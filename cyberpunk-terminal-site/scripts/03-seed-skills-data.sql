-- Insert skills data from static content
INSERT INTO skills (
  id, name, category, proficiency_level, description, 
  years_experience, last_used, created_at, updated_at
) VALUES 
-- Cloud Skills
(gen_random_uuid(), 'AWS', 'cloud', 95, 'Amazon Web Services mastery', 8, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Google Cloud', 'cloud', 80, 'Google Cloud Platform expertise', 5, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Azure', 'cloud', 70, 'Microsoft Azure proficiency', 4, NOW(), NOW(), NOW()),

-- Container Skills
(gen_random_uuid(), 'Kubernetes', 'containers', 92, 'Container orchestration expert', 6, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Docker', 'containers', 90, 'Containerization specialist', 7, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Helm', 'containers', 85, 'Kubernetes package manager', 4, NOW(), NOW(), NOW()),

-- Programming Skills
(gen_random_uuid(), 'Python', 'programming', 90, 'Python programming master', 10, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Go', 'programming', 75, 'Golang developer', 3, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'JavaScript', 'programming', 85, 'Full-stack JavaScript', 8, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Bash', 'programming', 95, 'Shell scripting wizard', 12, NOW(), NOW(), NOW()),

-- Infrastructure Skills
(gen_random_uuid(), 'Terraform', 'infrastructure', 95, 'Infrastructure as Code expert', 6, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Ansible', 'infrastructure', 80, 'Configuration management', 5, NOW(), NOW(), NOW()),

-- Security Skills
(gen_random_uuid(), 'HashiCorp Vault', 'security', 80, 'Secrets management', 4, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Open Policy Agent', 'security', 72, 'Policy as Code', 2, NOW(), NOW(), NOW()),

-- Monitoring Skills
(gen_random_uuid(), 'Prometheus', 'monitoring', 85, 'Metrics and monitoring', 5, NOW(), NOW(), NOW()),
(gen_random_uuid(), 'Grafana', 'monitoring', 88, 'Visualization expert', 5, NOW(), NOW(), NOW());
