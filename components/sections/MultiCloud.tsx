'use client';

import { useState } from 'react';
import { SectionNumber } from '@/components/layout/SectionNumber';
import { cn } from '@/lib/utils';

type Provider = 'AWS' | 'Azure' | 'GCP';

const CLOUDS: Record<Provider, string[]> = {
  AWS: [
    'PostgreSQL → Azure MSSQL pipeline via AWS DMS + custom triggers — +30% revenue lift on BI dashboards.',
    '35% AWS cost out via rightsizing + Lambda lifecycle automation (CloudWatch Events); 65% provisioning time out via Terraform + AWS CDK.',
    'AWS WAF + reCAPTCHA cut fraudulent activity 70%; ELK + Elastic APM cut MTTD / MTTR 30%.',
    'AWS Cognito (OIDC) integrated with Ruby on Rails + Azure AD for SSO.',
  ],
  Azure: [
    'Azure MSSQL hosted the target side of the cross-cloud DMS data pipeline.',
    'Azure AD (OIDC) wired into the SSO flow alongside AWS Cognito.',
    'Bash + parallel processing for cross-cloud backup / restore — 80% manual setup time out, 40% perf gain.',
  ],
  GCP: [
    'Google Professional Cloud Architect certified (Jan 2024).',
    'Certified Partner Specialist — Gemini Enterprise Agent Development (Aug 2026).',
    'Certified Partner Specialist — Gemini Enterprise Deployment (Aug 2026).',
  ],
};

const PROVIDER_TINT: Record<Provider, string> = {
  AWS: 'text-[#FF9900]',
  Azure: 'text-[#3CC0F0]',
  GCP: 'text-[#34A853]',
};

const PROVIDER_ORDER: Provider[] = ['AWS', 'Azure', 'GCP'];

export function MultiCloud({ index, total }: { index: number; total: number }) {
  const [active, setActive] = useState<Provider>('AWS');

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
        I've shipped production workloads across AWS, Azure, and GCP. Pick a provider
        to see what I built there.
      </p>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Cloud provider"
        className="mt-12 flex flex-wrap gap-2 border-b border-border"
      >
        {PROVIDER_ORDER.map((p) => {
          const isActive = p === active;
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(p)}
              className={cn(
                'relative -mb-px border-b-2 px-4 py-2 font-mono text-sm uppercase tracking-[0.2em] transition-colors',
                isActive
                  ? `border-accent ${PROVIDER_TINT[p]}`
                  : 'border-transparent text-muted hover:text-text'
              )}
            >
              {p}
              <span className="ml-2 text-xs text-muted">
                ({CLOUDS[p].length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="mt-8 border-l border-border pl-6"
      >
        <h3 className={cn('font-display text-3xl transition-colors', PROVIDER_TINT[active])}>
          {active}
        </h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text">
          {CLOUDS[active].map((a, i) => (
            <li key={`${active}-${i}`} className="leading-relaxed">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
