"use client"

import { useState, useEffect } from "react"
import { Package, ShoppingCart, AlertTriangle, TrendingUp, DollarSign, Users } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  lowStockThreshold: number
  status: "active" | "inactive" | "out-of-stock"
  sales: number
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: number
  date: string
}

export default function EcommerceDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    conversionRate: 0,
  })

  useEffect(() => {
    const generateProducts = (): Product[] => {
      const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Beauty"]
      const statuses = ["active", "inactive", "out-of-stock"] as const

      return Array.from({ length: 20 }, (_, i) => ({
        id: `prod-${i + 1}`,
        name: `Product ${i + 1}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: Math.floor(Math.random() * 500) + 10,
        stock: Math.floor(Math.random() * 100),
        lowStockThreshold: 10,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        sales: Math.floor(Math.random() * 1000),
      }))
    }

    const generateOrders = (): Order[] => {
      const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const
      const customers = [
        "John Doe",
        "Jane Smith",
        "Mike Johnson",
        "Sarah Wilson",
        "David Brown",
        "Lisa Davis",
        "Tom Anderson",
        "Emma Taylor",
      ]

      return Array.from({ length: 15 }, (_, i) => ({
        id: `order-${i + 1}`,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        customerEmail: `customer${i + 1}@example.com`,
        total: Math.floor(Math.random() * 500) + 20,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        items: Math.floor(Math.random() * 5) + 1,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      }))
    }

    const updateData = () => {
      const newProducts = generateProducts()
      const newOrders = generateOrders()

      setProducts(newProducts)
      setOrders(newOrders)

      const lowStockItems = newProducts.filter((p) => p.stock < p.lowStockThreshold).length
      const totalRevenue = newOrders.reduce((acc, order) => acc + order.total, 0)
      const avgOrderValue = newOrders.length > 0 ? totalRevenue / newOrders.length : 0

      setMetrics({
        totalProducts: newProducts.length,
        lowStockItems,
        totalOrders: newOrders.length,
        totalRevenue,
        avgOrderValue,
        conversionRate: Math.random() * 5 + 2, // Mock conversion rate
      })
    }

    updateData()
    const interval = setInterval(updateData, 5000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "delivered":
        return "text-green-400 border-green-400/30 bg-green-400/5"
      case "pending":
      case "processing":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
      case "shipped":
        return "text-blue-400 border-blue-400/30 bg-blue-400/5"
      case "cancelled":
      case "inactive":
      case "out-of-stock":
        return "text-red-400 border-red-400/30 bg-red-400/5"
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
    }
  }

  return (
    <div className="p-6 bg-gray-950 text-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="text-gray-400 text-sm mb-6">
          <div>$ ecommerce-manager --inventory --orders --real-time</div>
          <div className="text-emerald-400">
            ecommerce@nexus:~/inventory$ monitoring {metrics.totalProducts} products, {metrics.totalOrders} orders
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="p-4 bg-emerald-400/5 border border-emerald-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-6 h-6 text-emerald-400" />
            <span className="text-xs text-emerald-400 font-mono">PRODUCTS</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{metrics.totalProducts}</div>
          <div className="text-sm text-gray-400">Total Items</div>
        </div>

        <div className="p-4 bg-red-400/5 border border-red-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <span className="text-xs text-red-400 font-mono">LOW STOCK</span>
          </div>
          <div className="text-2xl font-bold text-red-400">{metrics.lowStockItems}</div>
          <div className="text-sm text-gray-400">Need Restock</div>
        </div>

        <div className="p-4 bg-blue-400/5 border border-blue-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-6 h-6 text-blue-400" />
            <span className="text-xs text-blue-400 font-mono">ORDERS</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{metrics.totalOrders}</div>
          <div className="text-sm text-gray-400">Total Orders</div>
        </div>

        <div className="p-4 bg-green-400/5 border border-green-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <span className="text-xs text-green-400 font-mono">REVENUE</span>
          </div>
          <div className="text-2xl font-bold text-green-400">${metrics.totalRevenue.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Revenue</div>
        </div>

        <div className="p-4 bg-purple-400/5 border border-purple-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <span className="text-xs text-purple-400 font-mono">AOV</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">${metrics.avgOrderValue.toFixed(0)}</div>
          <div className="text-sm text-gray-400">Avg Order Value</div>
        </div>

        <div className="p-4 bg-cyan-400/5 border border-cyan-400/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">CONVERSION</span>
          </div>
          <div className="text-2xl font-bold text-cyan-400">{metrics.conversionRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-400">Conversion Rate</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Product Inventory</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className={`p-3 rounded border cursor-pointer transition-all hover:scale-[1.02] ${getStatusColor(product.status)}`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm">{product.name}</span>
                  <span className="text-xs font-mono">${product.price}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{product.category}</span>
                  <span>Stock: {product.stock}</span>
                </div>
                {product.stock < product.lowStockThreshold && (
                  <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Low Stock Alert
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-gray-900/50 border border-green-500/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">Recent Orders</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {orders.map((order) => (
              <div key={order.id} className={`p-3 rounded border ${getStatusColor(order.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm">{order.id}</span>
                  <span className="text-xs font-mono">${order.total}</span>
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  {order.customerName} • {order.items} items
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{order.date}</span>
                  <span className={`px-2 py-1 rounded text-xs font-mono ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
