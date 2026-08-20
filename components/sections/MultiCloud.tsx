import { SectionNumber } from '@/components/layout/SectionNumber';

const CLOUDS = [
  {
    name: 'AWS',
    color: 'text-accent',
    achievements: [
      'PostgreSQL → Azure MSSQL pipeline via AWS DMS + custom triggers — +30% revenue lift on BI dashboards.',
      '35% AWS cost out via rightsizing + Lambda lifecycle automation (CloudWatch Events); 65% provisioning time out via Terraform + AWS CDK.',
      'AWS WAF + reCAPTCHA cut fraudulent activity 70%; ELK + Elastic APM cut MTTD / MTTR 30%.',
      'AWS Cognito (OIDC) integrated with Ruby on Rails + Azure AD for SSO.',
    ],
  },
  {
    name: 'Azure',
    color: 'text-accent',
    achievements: [
      'Azure MSSQL hosted the target side of the cross-cloud DMS data pipeline.',
      'Azure AD (OIDC) wired into the SSO flow alongside AWS Cognito.',
      'Bash + parallel processing for cross-cloud backup / restore — 80% manual setup time out, 40% perf gain.',
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
        I've shipped production workloads across AWS and Azure. Here's what each taught me.
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
