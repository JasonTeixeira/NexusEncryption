-- Enhanced Project Schema
-- This script adds comprehensive fields for detailed project management

-- Add new columns to projects table for enhanced functionality
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'web' CHECK (project_type IN ('web', 'mobile', 'desktop', 'api', 'infrastructure', 'ml', 'blockchain')),
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS complexity TEXT DEFAULT 'medium' CHECK (complexity IN ('low', 'medium', 'high', 'enterprise')),
ADD COLUMN IF NOT EXISTS team_size INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS duration_months INTEGER,
ADD COLUMN IF NOT EXISTS budget_range TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS demo_url TEXT,
ADD COLUMN IF NOT EXISTS documentation_url TEXT,
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS screenshots TEXT[],
ADD COLUMN IF NOT EXISTS architecture_diagram TEXT,
ADD COLUMN IF NOT EXISTS deployment_url TEXT,
ADD COLUMN IF NOT EXISTS monitoring_url TEXT,
ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS challenges TEXT[],
ADD COLUMN IF NOT EXISTS solutions TEXT[],
ADD COLUMN IF NOT EXISTS impact_metrics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS lessons_learned TEXT[],
ADD COLUMN IF NOT EXISTS future_improvements TEXT[],
ADD COLUMN IF NOT EXISTS code_examples JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS api_endpoints JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS database_schema TEXT,
ADD COLUMN IF NOT EXISTS security_features TEXT[],
ADD COLUMN IF NOT EXISTS performance_metrics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS testing_coverage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS deployment_strategy TEXT,
ADD COLUMN IF NOT EXISTS infrastructure_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS third_party_integrations TEXT[],
ADD COLUMN IF NOT EXISTS environment_variables TEXT[],
ADD COLUMN IF NOT EXISTS build_commands TEXT[],
ADD COLUMN IF NOT EXISTS deployment_commands TEXT[],
ADD COLUMN IF NOT EXISTS maintenance_notes TEXT,
ADD COLUMN IF NOT EXISTS version TEXT DEFAULT '1.0.0',
ADD COLUMN IF NOT EXISTS license TEXT DEFAULT 'MIT',
ADD COLUMN IF NOT EXISTS contributors TEXT[],
ADD COLUMN IF NOT EXISTS stars INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS forks INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS issues INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pull_requests INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_commit_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS github_stats JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS deployment_status TEXT DEFAULT 'deployed' CHECK (deployment_status IN ('deployed', 'staging', 'development', 'maintenance', 'deprecated')),
ADD COLUMN IF NOT EXISTS health_check_url TEXT,
ADD COLUMN IF NOT EXISTS monitoring_alerts JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS backup_strategy TEXT,
ADD COLUMN IF NOT EXISTS disaster_recovery TEXT,
ADD COLUMN IF NOT EXISTS compliance_standards TEXT[],
ADD COLUMN IF NOT EXISTS accessibility_score INTEGER DEFAULT 0 CHECK (accessibility_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS seo_score INTEGER DEFAULT 0 CHECK (seo_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS performance_score INTEGER DEFAULT 0 CHECK (performance_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS security_score INTEGER DEFAULT 0 CHECK (security_score BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS cost_per_month DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS roi_percentage DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_feedback JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS analytics_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS feature_flags JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS ab_tests JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS error_tracking JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS uptime_percentage DECIMAL(5,2) DEFAULT 99.9,
ADD COLUMN IF NOT EXISTS load_test_results JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS scalability_notes TEXT,
ADD COLUMN IF NOT EXISTS optimization_history JSONB DEFAULT '[]';

-- Create project tags table
CREATE TABLE IF NOT EXISTS public.project_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#00ff41',
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('technology', 'framework', 'language', 'tool', 'platform', 'methodology', 'industry', 'general')),
  project_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project-tags junction table
CREATE TABLE IF NOT EXISTS public.project_tag_assignments (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.project_tags(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (project_id, tag_id)
);

-- Create project milestones table
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  priority INTEGER DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  assigned_to TEXT,
  deliverables TEXT[],
  acceptance_criteria TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project dependencies table
CREATE TABLE IF NOT EXISTS public.project_dependencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  version TEXT,
  type TEXT DEFAULT 'npm' CHECK (type IN ('npm', 'pip', 'gem', 'maven', 'nuget', 'composer', 'cargo', 'go', 'other')),
  description TEXT,
  license TEXT,
  homepage_url TEXT,
  repository_url TEXT,
  vulnerability_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE,
  is_dev_dependency BOOLEAN DEFAULT FALSE,
  is_critical BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project environments table
CREATE TABLE IF NOT EXISTS public.project_environments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'production' CHECK (type IN ('development', 'staging', 'production', 'testing')),
  url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  last_deployment TIMESTAMP WITH TIME ZONE,
  deployment_branch TEXT DEFAULT 'main',
  environment_variables JSONB DEFAULT '{}',
  health_check_url TEXT,
  monitoring_url TEXT,
  logs_url TEXT,
  cpu_usage DECIMAL(5,2) DEFAULT 0,
  memory_usage DECIMAL(5,2) DEFAULT 0,
  disk_usage DECIMAL(5,2) DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  uptime_percentage DECIMAL(5,2) DEFAULT 99.9,
  error_rate DECIMAL(5,2) DEFAULT 0,
  throughput_rps INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project reviews table
CREATE TABLE IF NOT EXISTS public.project_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT,
  reviewer_role TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  content TEXT NOT NULL,
  pros TEXT[],
  cons TEXT[],
  recommendations TEXT[],
  would_recommend BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON public.projects(priority);
CREATE INDEX IF NOT EXISTS idx_projects_complexity ON public.projects(complexity);
CREATE INDEX IF NOT EXISTS idx_projects_deployment_status ON public.projects(deployment_status);
CREATE INDEX IF NOT EXISTS idx_project_tags_category ON public.project_tags(category);
CREATE INDEX IF NOT EXISTS idx_project_tags_slug ON public.project_tags(slug);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON public.project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON public.project_milestones(status);
CREATE INDEX IF NOT EXISTS idx_project_dependencies_project_id ON public.project_dependencies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_environments_project_id ON public.project_environments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_environments_type ON public.project_environments(type);
CREATE INDEX IF NOT EXISTS idx_project_reviews_project_id ON public.project_reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_project_reviews_rating ON public.project_reviews(rating);

-- Enable RLS on new tables
ALTER TABLE public.project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tag_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Project tags are viewable by everyone" ON public.project_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage project tags" ON public.project_tags FOR ALL USING (auth.role() = 'admin');

CREATE POLICY "Project tag assignments are viewable by everyone" ON public.project_tag_assignments FOR SELECT USING (true);
CREATE POLICY "Admins and editors can manage project tag assignments" ON public.project_tag_assignments FOR ALL USING (auth.role() IN ('admin', 'editor'));

CREATE POLICY "Project milestones are viewable by everyone" ON public.project_milestones FOR SELECT USING (true);
CREATE POLICY "Admins and editors can manage project milestones" ON public.project_milestones FOR ALL USING (auth.role() IN ('admin', 'editor'));

CREATE POLICY "Project dependencies are viewable by everyone" ON public.project_dependencies FOR SELECT USING (true);
CREATE POLICY "Admins and editors can manage project dependencies" ON public.project_dependencies FOR ALL USING (auth.role() IN ('admin', 'editor'));

CREATE POLICY "Project environments are viewable by everyone" ON public.project_environments FOR SELECT USING (true);
CREATE POLICY "Admins and editors can manage project environments" ON public.project_environments FOR ALL USING (auth.role() IN ('admin', 'editor'));

CREATE POLICY "Project reviews are viewable by everyone" ON public.project_reviews FOR SELECT USING (true);
CREATE POLICY "Anyone can create project reviews" ON public.project_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage all project reviews" ON public.project_reviews FOR ALL USING (auth.role() = 'admin');

-- Add triggers for updated_at on new tables
CREATE TRIGGER handle_project_tags_updated_at BEFORE UPDATE ON public.project_tags FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_project_milestones_updated_at BEFORE UPDATE ON public.project_milestones FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_project_environments_updated_at BEFORE UPDATE ON public.project_environments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER handle_project_reviews_updated_at BEFORE UPDATE ON public.project_reviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to update project tag counts
CREATE OR REPLACE FUNCTION public.update_project_tag_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.project_tags 
    SET project_count = project_count - 1 
    WHERE id = OLD.tag_id;
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    UPDATE public.project_tags 
    SET project_count = project_count + 1 
    WHERE id = NEW.tag_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for project tag count updates
CREATE TRIGGER update_project_tag_count_trigger
  AFTER INSERT OR DELETE ON public.project_tag_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_project_tag_count();

-- Create function to calculate project completion percentage
CREATE OR REPLACE FUNCTION public.calculate_project_completion(project_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_milestones INTEGER;
  completed_milestones INTEGER;
  completion_percentage DECIMAL(5,2);
BEGIN
  SELECT COUNT(*) INTO total_milestones 
  FROM public.project_milestones 
  WHERE project_id = project_uuid;
  
  IF total_milestones = 0 THEN
    RETURN 100.00;
  END IF;
  
  SELECT COUNT(*) INTO completed_milestones 
  FROM public.project_milestones 
  WHERE project_id = project_uuid AND status = 'completed';
  
  completion_percentage := (completed_milestones::DECIMAL / total_milestones::DECIMAL) * 100;
  
  RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql;

-- Create function to get project health score
CREATE OR REPLACE FUNCTION public.calculate_project_health_score(project_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  health_score INTEGER := 0;
  uptime_score INTEGER := 0;
  performance_score INTEGER := 0;
  security_score INTEGER := 0;
  accessibility_score INTEGER := 0;
  seo_score INTEGER := 0;
BEGIN
  SELECT 
    COALESCE(uptime_percentage, 0),
    COALESCE(performance_score, 0),
    COALESCE(security_score, 0),
    COALESCE(accessibility_score, 0),
    COALESCE(seo_score, 0)
  INTO uptime_score, performance_score, security_score, accessibility_score, seo_score
  FROM public.projects 
  WHERE id = project_uuid;
  
  -- Calculate weighted health score
  health_score := (
    (uptime_score * 0.3) +
    (performance_score * 0.25) +
    (security_score * 0.25) +
    (accessibility_score * 0.1) +
    (seo_score * 0.1)
  )::INTEGER;
  
  RETURN LEAST(health_score, 100);
END;
$$ LANGUAGE plpgsql;

-- Insert default project tags
INSERT INTO public.project_tags (name, slug, color, description, category) VALUES
('React', 'react', '#61DAFB', 'JavaScript library for building user interfaces', 'framework'),
('Next.js', 'nextjs', '#000000', 'React framework for production', 'framework'),
('TypeScript', 'typescript', '#3178C6', 'Typed superset of JavaScript', 'language'),
('Node.js', 'nodejs', '#339933', 'JavaScript runtime built on Chrome V8 engine', 'platform'),
('Python', 'python', '#3776AB', 'High-level programming language', 'language'),
('AWS', 'aws', '#FF9900', 'Amazon Web Services cloud platform', 'platform'),
('Docker', 'docker', '#2496ED', 'Containerization platform', 'tool'),
('Kubernetes', 'kubernetes', '#326CE5', 'Container orchestration platform', 'platform'),
('PostgreSQL', 'postgresql', '#336791', 'Open source relational database', 'technology'),
('Redis', 'redis', '#DC382D', 'In-memory data structure store', 'technology'),
('GraphQL', 'graphql', '#E10098', 'Query language for APIs', 'technology'),
('REST API', 'rest-api', '#00D9FF', 'Representational State Transfer API', 'methodology'),
('Microservices', 'microservices', '#FF6B6B', 'Architectural pattern', 'methodology'),
('CI/CD', 'cicd', '#4CAF50', 'Continuous Integration/Continuous Deployment', 'methodology'),
('Machine Learning', 'machine-learning', '#FF6F00', 'AI and ML technologies', 'technology'),
('Blockchain', 'blockchain', '#F7931A', 'Distributed ledger technology', 'technology'),
('Mobile', 'mobile', '#A4C639', 'Mobile application development', 'platform'),
('Web3', 'web3', '#627EEA', 'Decentralized web technologies', 'technology'),
('DevOps', 'devops', '#326CE5', 'Development and Operations practices', 'methodology'),
('Security', 'security', '#FF5722', 'Cybersecurity and data protection', 'methodology')
ON CONFLICT (slug) DO NOTHING;
