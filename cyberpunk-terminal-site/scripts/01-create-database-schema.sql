-- Portfolio Database Schema
-- This script creates all the tables needed for dynamic content management

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT,
  tech_stack TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  featured BOOLEAN DEFAULT FALSE,
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  uptime DECIMAL(5,2) DEFAULT 99.9,
  requests_per_day INTEGER DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,
  featured_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#00ff41',
  icon TEXT,
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#00ff41',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction tables
CREATE TABLE IF NOT EXISTS public.blog_post_categories (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create analytics table for performance monitoring
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  page_path TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  referrer TEXT,
  session_id TEXT,
  user_id UUID REFERENCES public.profiles(id),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search index table for full-text search
CREATE TABLE IF NOT EXISTS public.search_index (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('project', 'blog_post')),
  content_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_search_vector ON public.search_index USING gin(search_vector);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_search_content ON public.search_index USING gin(to_tsvector('english', title || ' ' || content));

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_index ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects: Public read, admin/editor write
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (status = 'active' OR auth.role() IN ('admin', 'editor'));
CREATE POLICY "Admins and editors can manage projects" ON public.projects FOR ALL USING (auth.role() IN ('admin', 'editor'));

-- Blog posts: Public read for published, admin/editor write
CREATE POLICY "Published blog posts are viewable by everyone" ON public.blog_posts FOR SELECT USING (status = 'published' OR auth.role() IN ('admin', 'editor'));
CREATE POLICY "Admins and editors can manage blog posts" ON public.blog_posts FOR ALL USING (auth.role() IN ('admin', 'editor'));

-- Categories and tags: Public read, admin write
CREATE POLICY "Categories are viewable by everyone" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.blog_categories FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Tags are viewable by everyone" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.blog_tags FOR ALL USING (auth.role() = 'admin');

-- Analytics: Admin only
CREATE POLICY "Admins can view analytics" ON public.analytics FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Anyone can insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);

-- Search index: Public read, system write
CREATE POLICY "Search index is viewable by everyone" ON public.search_index FOR SELECT USING (true);
CREATE POLICY "System can manage search index" ON public.search_index FOR ALL USING (auth.role() IN ('admin', 'service_role'));

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_search_index_updated_at BEFORE UPDATE ON public.search_index FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update search index
CREATE OR REPLACE FUNCTION public.update_search_index()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.search_index WHERE content_type = TG_ARGV[0] AND content_id = OLD.id;
    RETURN OLD;
  ELSE
    INSERT INTO public.search_index (content_type, content_id, title, content, search_vector)
    VALUES (
      TG_ARGV[0],
      NEW.id,
      NEW.title,
      COALESCE(NEW.content, NEW.description, ''),
      to_tsvector('english', NEW.title || ' ' || COALESCE(NEW.content, NEW.description, ''))
    )
    ON CONFLICT (content_type, content_id) 
    DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      search_vector = EXCLUDED.search_vector,
      updated_at = NOW();
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for search index updates
CREATE TRIGGER update_projects_search_index
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_search_index('project');

CREATE TRIGGER update_blog_posts_search_index
  AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_search_index('blog_post');
