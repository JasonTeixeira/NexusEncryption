-- Insert projects data from static content
INSERT INTO projects (
  id, title, slug, description, status, technologies, 
  github_url, demo_url, featured, category, created_at, updated_at
) VALUES 
(
  gen_random_uuid(),
  'NEXUS CLOUD INFRASTRUCTURE',
  'nexus-cloud-infrastructure',
  'AWS Multi-Region Deployment with Kubernetes Orchestration. A comprehensive cloud infrastructure solution built for scale and reliability.',
  'operational',
  ARRAY['AWS', 'Kubernetes', 'Terraform', 'Docker'],
  'https://github.com/JasonTeixeira/nexus-cloud',
  'https://nexus-cloud.demo.com',
  true,
  'Cloud Infrastructure',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'QUANTUM DATA PIPELINE',
  'quantum-data-pipeline',
  'Real-time data processing with ML integration. Advanced streaming data pipeline with machine learning capabilities for real-time analytics.',
  'active',
  ARRAY['Apache Kafka', 'Spark', 'TensorFlow', 'Python'],
  'https://github.com/JasonTeixeira/quantum-pipeline',
  'https://quantum-pipeline.demo.com',
  true,
  'Data Engineering',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'CYBERSECURITY FORTRESS',
  'cybersecurity-fortress',
  'Advanced threat detection and response system. Comprehensive security platform with AI-powered threat detection and automated response capabilities.',
  'monitoring',
  ARRAY['SIEM', 'IDS/IPS', 'Machine Learning', 'SOC'],
  'https://github.com/JasonTeixeira/security-fortress',
  'https://security-fortress.demo.com',
  true,
  'Security',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'NEURAL NETWORK OPTIMIZER',
  'neural-network-optimizer',
  'AI-driven infrastructure optimization platform. Intelligent system that uses neural networks to optimize cloud infrastructure performance and costs.',
  'experimental',
  ARRAY['PyTorch', 'Kubernetes', 'Prometheus', 'Grafana'],
  'https://github.com/JasonTeixeira/neural-optimizer',
  'https://neural-optimizer.demo.com',
  false,
  'AI/ML',
  NOW(),
  NOW()
);
