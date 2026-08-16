import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CASE_STUDIES, getCaseStudy } from '@/content/case-studies';
import { CaseStudyHero } from '@/components/case-studies/CaseStudyHero';
import { CaseStudyLayout } from '@/components/case-studies/CaseStudyLayout';

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = getCaseStudy(slug);
  if (!meta) notFound();
  return (
    <CaseStudyLayout>
      <CaseStudyHero meta={meta} />
      {/* MDX content rendered by sibling mdx file */}
      <div className="mx-auto max-w-3xl px-6 pb-24">
        <Link href="/" className="font-mono text-xs uppercase tracking-widest text-accent hover:underline">
          ← Back home
        </Link>
      </div>
    </CaseStudyLayout>
  );
}
