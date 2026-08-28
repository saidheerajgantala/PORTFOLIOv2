import type { CertificationMeta } from '@/lib/types';

export const CERTIFICATIONS: CertificationMeta[] = [
  {
    slug: 'aws-ml-associate',
    title: 'AWS Certified Machine Learning Engineer — Associate',
    issuer: 'Amazon Web Services',
    issued: '2025-01',
    description:
      'Designing, training, tuning, and deploying ML models on AWS — data engineering, feature stores, SageMaker pipelines, and MLOps for production inference.',
    skills: ['SageMaker', 'Feature Store', 'ML Pipelines', 'Model Tuning', 'Inference'],
  },
  {
    slug: 'aws-devops-pro',
    title: 'AWS Certified DevOps Engineer — Professional',
    issuer: 'Amazon Web Services',
    issued: '2025-01',
    description:
      'CI/CD, infrastructure as code, observability, and incident response at scale — multi-account AWS orgs, blue/green and canary deploys, and automated compliance.',
    skills: ['CodePipeline', 'CodeBuild', 'CloudFormation', 'CloudWatch', 'Incident Response'],
    href: 'https://www.credly.com/badges/beaba153-e27f-4e66-ae75-adb1d8b9810b/public_url',
  },
  {
    slug: 'cisco-ethical-hacker',
    title: 'Ethical Hacker',
    issuer: 'Cisco',
    issued: '2025-01',
    description:
      'Offensive security fundamentals — reconnaissance, scanning, exploitation, and post-exploitation across networks, web apps, and wireless — used here to harden the platforms I ship.',
    skills: ['Recon', 'Web Exploits', 'Network Scanning', 'OWASP Top 10'],
  },
  {
    slug: 'gcp-architect',
    title: 'Google Professional Cloud Architect',
    issuer: 'Google',
    issued: '2024-01',
    description:
      'Architecting reliable, secure, cost-optimized workloads on GCP — multi-region HA, IAM design, networking, and migration strategy across the Google Cloud service catalog.',
    skills: ['GKE', 'BigQuery', 'Cloud Run', 'IAM', 'Multi-region HA'],
    href: 'https://www.credly.com/badges/1ffec24f-c758-4b83-abac-ca1218ff6b11',
  },
  {
    slug: 'infosys-csp',
    title: 'Infosys Certified Software Programmer',
    issuer: 'Infosys',
    issued: '2022-01',
    description:
      'Foundational software engineering — OOP, data structures, SQL, and unit testing discipline; the baseline I built my platform work on.',
    skills: ['OOP', 'Data Structures', 'SQL', 'Unit Testing'],
  },
  {
    slug: 'google-gemini-agent-dev',
    title: 'Certified Partner Specialist — Gemini Enterprise Agent Development',
    issuer: 'Google',
    issued: '2026-08',
    description:
      'Building production agents on the Gemini Enterprise stack — tool-use, function calling, evaluation harnesses, and orchestration patterns for multi-step reasoning.',
    skills: ['Gemini', 'Function Calling', 'Agent Orchestration', 'Evals'],
  },
  {
    slug: 'google-gemini-deployment',
    title: 'Certified Partner Specialist — Gemini Enterprise Deployment',
    issuer: 'Google',
    issued: '2026-08',
    description:
      'Shipping Gemini-powered features to enterprise tenants — secure deployment, quota planning, observability, and rollout patterns for production agent workloads.',
    skills: ['Gemini', 'Tenant Isolation', 'Quota Planning', 'Rollout Strategy'],
  },
];
