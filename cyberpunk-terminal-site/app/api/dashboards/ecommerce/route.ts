import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")

    let productsQuery = supabase.from("ecommerce_products").select("*")
    const ordersQuery = supabase.from("ecommerce_orders").select("*")

    if (category) productsQuery = productsQuery.eq("category", category)
    if (status) productsQuery = productsQuery.eq("status", status)

    const [{ data: products, error: productsError }, { data: orders, error: ordersError }] = await Promise.all([
      productsQuery.order("created_at", { ascending: false }),
      ordersQuery.order("created_at", { ascending: false }).limit(50),
    ])

    if (productsError) throw productsError
    if (ordersError) throw ordersError

    // Calculate metrics
    const totalProducts = products?.length || 0
    const lowStockProducts = products?.filter((p) => p.stock_quantity < p.low_stock_threshold).length || 0
    const totalOrders = orders?.length || 0
    const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0

    const totalRevenue = orders?.reduce((acc, order) => acc + (order.total_amount || 0), 0) || 0

    return NextResponse.json({
      products: products || [],
      orders: orders || [],
      metrics: {
        totalProducts,
        lowStockProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        averageOrderValue: totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0,
      },
    })
  } catch (error) {
    console.error("E-commerce API Error:", error)
    return NextResponse.json({ error: "Failed to fetch e-commerce data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { type } = body // 'product' or 'order'

    if (type === "product") {
      const { data: product, error } = await supabase
        .from("ecommerce_products")
        .insert([
          {
            name: body.name,
            category: body.category,
            price: body.price,
            stock_quantity: body.stock_quantity,
            low_stock_threshold: body.low_stock_threshold || 10,
            status: body.status || "active",
          },
        ])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ product })
    } else if (type === "order") {
      const { data: order, error } = await supabase
        .from("ecommerce_orders")
        .insert([
          {
            customer_name: body.customer_name,
            customer_email: body.customer_email,
            total_amount: body.total_amount,
            status: body.status || "pending",
            items: body.items,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return NextResponse.json({ order })
    }

    return NextResponse.json({ error: "Invalid type specified" }, { status: 400 })
  } catch (error) {
    console.error("E-commerce Creation Error:", error)
    return NextResponse.json({ error: "Failed to create e-commerce item" }, { status: 500 })
  }
}
