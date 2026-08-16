import { SectionNumber } from '@/components/layout/SectionNumber';

const CLOUDS = [
  {
    name: 'AWS',
    color: 'text-accent',
    achievements: [
      'Migrated 40+ services from EC2-classic to EKS',
      'Owned multi-region failover architecture',
      'Cut RDS costs 30% via Aurora tier-down + reserved capacity',
    ],
  },
  {
    name: 'GCP',
    color: 'text-accent',
    achievements: [
      'Designed Cloud Run deployment platform for AI workloads',
      'Migrated batch processing from VMs to Dataflow',
      'Built Terraform module library used across 6 product teams',
    ],
  },
  {
    name: 'Azure',
    color: 'text-accent',
    achievements: [
      'Led AKS adoption for regulated workloads',
      'Integrated Azure AD / Entra ID into the agent platform',
      'Owned cost governance dashboards via FinOps practices',
    ],
  },
];

export function MultiCloud({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="multi-cloud"
      aria-labelledby="multi-cloud-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="multi-cloud-heading" className="mt-4 font-display text-4xl text-text">
        Multi-cloud DevOps
      </h2>
      <p className="mt-4 text-muted max-w-prose">
        I've shipped production workloads across all three major clouds. Here's what each taught me.
      </p>
      <div className="mt-12 space-y-12">
        {CLOUDS.map((cloud) => (
          <article key={cloud.name} className="border-l border-border pl-6">
            <h3 className={`font-display text-3xl ${cloud.color}`}>{cloud.name}</h3>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-text">
              {cloud.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}