import type { CareerStop } from '@/lib/types';

export const CAREER: CareerStop[] = [
  {
    id: 'epam-agent-platform',
    period: 'Oct 2025 — Present',
    title: 'System Engineer — Enterprise Agent Platform',
    company: 'EPAM Systems',
    location: 'Bengaluru, India',
    achievements: [
      'Building the enterprise AI agent platform — MCP integrations, agentic workflows, operator review loops.',
      'Multi-tenant RBAC and role-based dashboards for developer self-service + operator approval flows.',
      'Orchestrated long-running workflows on Temporal; LangGraph + Google ADK agents in production.',
    ],
  },
  {
    id: 'premium-parking-xebia',
    period: 'Jul 2023 — Sep 2025',
    title: 'Software Engineer — Cloud, Data & DevOps',
    company: 'Premium Parking (Xebia)',
    location: 'Hyderabad, India',
    achievements: [
      '30% revenue lift via end-to-end PostgreSQL→MSSQL data pipeline (AWS DMS + custom triggers powering BI).',
      '35% AWS cost out via rightsizing + lifecycle automation (Lambda + CloudWatch Events); 65% provisioning time out via Terraform + AWS CDK.',
      '70% fraud reduction via reCAPTCHA + AWS WAF; ELK + Elastic APM cut MTTD/MTTR by 30%.',
    ],
  },
  {
    id: 'xebia-intern',
    period: 'Mar 2022 — Jun 2022',
    title: 'Engineer Intern',
    company: 'Xebia',
    location: 'Hyderabad, India',
    achievements: [
      'Tripled deployment frequency via GitHub Actions CI/CD; containerized apps, 30% deploy-time reduction.',
      'Hands-on Go, Docker, Java, Rails, Python, AWS, GCP across backend and cloud projects.',
    ],
  },
];
