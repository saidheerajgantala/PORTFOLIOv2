import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CASE_STUDIES, getCaseStudy } from '@/content/case-studies';
import { CaseStudyHero } from '@/components/case-studies/CaseStudyHero';
import { CaseStudyLayout } from '@/components/case-studies/CaseStudyLayout';
import AgentPlatform from '@/content/work/agent-platform.mdx';

const CONTENT: Record<string, React.ComponentType> = {
  'agent-platform': AgentPlatform,
};

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getCaseStudy(slug);
  if (!meta) return {};
  return { title: `${meta.title} — Saidheeraj Gantala` };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCaseStudy(slug);
  if (!meta) notFound();
  const Content = CONTENT[slug];
  return (
    <CaseStudyLayout>
      <CaseStudyHero meta={meta} />
      <div className="mx-auto max-w-3xl px-6 pb-24">
        {Content && <Content />}
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-accent hover:underline"
        >
          ← Back home
        </Link>
      </div>
    </CaseStudyLayout>
  );
}
