import { SectionNumber } from '@/components/layout/SectionNumber';

type Kind = 'award' | 'cert';

interface Item {
  kind: Kind;
  title: string;
  period: string;
  body: string;
  href?: string;
}

// All entries sourced from resume.txt — Awards + Certifications sections.
const ITEMS: Item[] = [
  // Awards
  {
    kind: 'award',
    title: 'GEM Award — Xebia',
    period: 'Jan 2024',
    body: 'Quarterly engineering excellence award at Xebia.',
    href:
      'https://media.licdn.com/dms/image/v2/D562DAQFNqIwJgaZG6Q/profile-treasury-image-shrink_1280_1280/profile-treasury-image-shrink_1280_1280/0/1738944384902',
  },
  {
    kind: 'award',
    title: 'Hall of Fame — BigBasket',
    period: 'Jan 2022',
    body: "Listed on BigBasket's security hall of fame for a disclosed vulnerability.",
    href: 'https://tech.bigbasket.com/security-at-bigbasket-5eaaa6fa7c89',
  },
  {
    kind: 'award',
    title: 'Cipher Combat 3.0 — 17th place',
    period: 'Jan 2020',
    body: 'National-level CTF-style competition.',
  },
  // Certifications
  {
    kind: 'cert',
    title: 'AWS Certified Machine Learning Engineer — Associate',
    period: 'Jan 2025',
    body: 'Issued by Amazon Web Services.',
  },
  {
    kind: 'cert',
    title: 'AWS Certified DevOps Engineer — Professional',
    period: 'Jan 2025',
    body: 'Issued by Amazon Web Services.',
    href: 'https://www.credly.com/badges/beaba153-e27f-4e66-ae75-adb1d8b9810b/public_url',
  },
  {
    kind: 'cert',
    title: 'Ethical Hacker — Cisco',
    period: 'Jan 2025',
    body: 'Issued by Cisco.',
  },
  {
    kind: 'cert',
    title: 'Google Professional Cloud Architect',
    period: 'Jan 2024',
    body: 'Issued by Google.',
    href: 'https://www.credly.com/badges/1ffec24f-c758-4b83-abac-ca1218ff6b11',
  },
  {
    kind: 'cert',
    title: 'Infosys Certified Software Programmer',
    period: 'Jan 2022',
    body: 'Issued by Infosys.',
  },
];

export function Recognition({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="recognition"
      aria-labelledby="recognition-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="recognition-heading" className="mt-4 font-display text-4xl text-text">
        Recognition
      </h2>
      <ul className="mt-12 space-y-8">
        {ITEMS.map((item) => {
          const TitleTag = item.href ? 'a' : 'h3';
          return (
            <li key={item.title} className="border-l border-border pl-6">
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                {item.kind} · {item.period}
              </p>
              <TitleTag
                {...(item.href
                  ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="mt-2 font-display text-xl text-text hover:text-accent"
              >
                {item.title}
              </TitleTag>
              <p className="mt-2 text-text">{item.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
