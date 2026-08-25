import type { CareerStop } from '@/lib/types';

export const CAREER: CareerStop[] = [
  {
    id: 'epam-agent-platform',
    period: 'Oct 2025 — Present',
    title: 'System Engineer — Enterprise Agent Platform',
    company: 'EPAM Systems',
    location: 'Bengaluru, India',
    achievements: [
      'Building an enterprise AI agent platform — MCP integrations, agentic workflows, operator review loops bridging AI and engineering automation.',
      'Data integration pipelines, multi-tenant RBAC, and role-based dashboards for developer self-service + operator approval flows.',
      'Customized Backstage developer portals + Software Templates integrating Jenkins, Jira, Vault, and internal engineering services.',
      'Orchestrated long-running workflows on Temporal; LangGraph + Google ADK agents in production reasoning across engineering systems.',
      'Designed AI-powered automation including an RCA system for troubleshooting and operational workflows.',
      'Integrated AI agents and MCP-based tool interactions into enterprise workflows, reducing manual intervention.',
    ],
  },
  {
    id: 'premium-parking-xebia',
    period: 'Jul 2023 — Sep 2025',
    title: 'Software Engineer — Cloud, Data & DevOps',
    company: 'Premium Parking (Xebia)',
    location: 'Hyderabad, India',
    achievements: [
      '30% revenue lift via end-to-end PostgreSQL→MSSQL data pipeline (AWS DMS + custom triggers powering near-real-time BI).',
      '80% backup-time out via Bash parallel-processing automations; 40% system-performance lift on restore workflows.',
      '70% fraud reduction via reCAPTCHA + AWS WAF; CloudWatch Insights queries for live threat signal.',
      '35% AWS cost out via rightsizing + lifecycle automation (Lambda + CloudWatch Events); 65% provisioning-time out via Terraform + AWS CDK.',
      'SSO via AWS Cognito + Ruby on Rails integrated with Azure AD (OIDC).',
      'MTTD/MTTR cut 30% via CloudWatch dashboards + ELK Stack + Elastic APM.',
      'Built an LLM-powered RAG chatbot backed by a Vector Database — 20% team productivity lift.',
    ],
  },
  {
    id: 'premium-parking-xebia-associate',
    period: 'Jul 2022 — Jun 2023',
    title: 'Associate Software Engineer — Backend & Microservices',
    company: 'Premium Parking (Xebia)',
    location: 'Hyderabad, India',
    achievements: [
      'Decoupled a monolith into microservices using Hasura GraphQL + React.js.',
      'Migrated Sidekiq background jobs to AWS Lambda in Python — 30% memory out, higher concurrency.',
      '70% app-startup-time cut via lazy loading, dependency optimization, and code splitting.',
      'Deployed ELK Stack for real-time log analysis, anomaly detection, and alerting — 70% critical-incident reduction.',
      'ECS auto-scaling policies on CPU + memory — 30% cloud-cost reduction.',
      'Resolved 90% of P1 incidents within four hours using structured response + root-cause analysis.',
      'Led Heroku → AWS migration of Rails apps + PostgreSQL across 15+ AWS services, zero downtime.',
    ],
  },
  {
    id: 'xebia-intern',
    period: 'Mar 2022 — Jun 2022',
    title: 'Engineer Intern',
    company: 'Xebia',
    location: 'Hyderabad, India',
    achievements: [
      'Tripled deployment frequency via GitHub Actions CI/CD; Dockerized apps + deployment validation, 30% deploy-time reduction.',
      'Hands-on Go, Docker, Java, Rails, Python, AWS, GCP across backend and cloud projects.',
    ],
  },
];
