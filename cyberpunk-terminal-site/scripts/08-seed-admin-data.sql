-- Insert sample projects
INSERT INTO projects (title, slug, description, long_description, technologies, github_url, live_url, status, featured) VALUES
('Nebula Cloud Orchestrator', 'nebula', 'Advanced multi-cloud orchestration platform with intelligent workload placement and cost optimization.', 'A comprehensive cloud orchestration platform that intelligently manages workloads across AWS, GCP, and Azure. Features include automated cost optimization, intelligent workload placement, real-time monitoring, and advanced security controls.', ARRAY['Kubernetes', 'Go', 'React', 'PostgreSQL', 'Redis'], 'https://github.com/nexusarchitect/nebula', 'https://nebula.sageideas.org', 'active', true),

('Quantum Data Pipeline', 'quantum-pipeline', 'High-performance data processing pipeline with real-time analytics and ML integration.', 'A cutting-edge data processing pipeline built for scale, handling petabytes of data with sub-second latency. Integrates advanced machine learning models for real-time insights and predictive analytics.', ARRAY['Apache Kafka', 'Spark', 'Python', 'TensorFlow', 'Elasticsearch'], 'https://github.com/nexusarchitect/quantum-pipeline', 'https://quantum.sageideas.org', 'active', true),

('CyberShield Security Suite', 'cybershield', 'Enterprise-grade security platform with AI-powered threat detection and automated response.', 'A comprehensive security platform that uses advanced AI algorithms to detect, analyze, and respond to cyber threats in real-time. Features include behavioral analysis, automated incident response, and compliance reporting.', ARRAY['Python', 'TensorFlow', 'Elasticsearch', 'Docker', 'Kubernetes'], 'https://github.com/nexusarchitect/cybershield', null, 'active', false);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, tags, status, read_time, category, views, likes, comments, published_at) VALUES
('The Future of Cloud Architecture', 'future-cloud-architecture', 'Exploring emerging trends in cloud architecture and their impact on enterprise systems.', '# The Future of Cloud Architecture\n\nCloud architecture is evolving rapidly...', ARRAY['cloud', 'architecture', 'technology'], 'published', 8, 'Technology', 1250, 45, 12, NOW() - INTERVAL '2 days'),

('Building Scalable Microservices', 'scalable-microservices', 'Best practices for designing and implementing microservices that scale.', '# Building Scalable Microservices\n\nMicroservices architecture has become...', ARRAY['microservices', 'scalability', 'architecture'], 'published', 12, 'Architecture', 890, 32, 8, NOW() - INTERVAL '5 days'),

('AI in DevOps: A Game Changer', 'ai-devops-game-changer', 'How artificial intelligence is revolutionizing DevOps practices and workflows.', '# AI in DevOps: A Game Changer\n\nArtificial intelligence is transforming...', ARRAY['ai', 'devops', 'automation'], 'draft', 10, 'AI & Automation', 0, 0, 0, null);
