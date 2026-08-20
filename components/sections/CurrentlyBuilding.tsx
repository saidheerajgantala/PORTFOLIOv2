import { SectionNumber } from '@/components/layout/SectionNumber';
import { StatusDot } from '@/components/layout/StatusDot';

interface CurrentBuild {
  name: string;
  description: string;
  stack: string[];
  status: 'active' | 'paused' | 'archived';
}

const BUILDS: CurrentBuild[] = [
  {
    name: 'Enterprise Agent Platform @ EPAM',
    description:
      'MCP-integrated agent workflows, multi-tenant RBAC, Temporal orchestration, LangGraph + Google ADK agents. Operator review and approval loops built in.',
    stack: ['Python', 'FastAPI', 'LangGraph', 'Temporal', 'Google ADK', 'Backstage'],
    status: 'active',
  },
  {
    name: 'Hiiired + Noxstack (personal)',
    description:
      'AI-powered recruiting (RAG + CrewAI) and community local-service discovery (FastAPI + LangChain). Solo weekend builds.',
    stack: ['FastAPI', 'Next.js', 'RAG', 'OpenAI', 'LangChain'],
    status: 'active',
  },
];

export function CurrentlyBuilding({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="currently-building"
      aria-labelledby="currently-building-heading"
      className="mx-auto w-full max-w-3xl px-6 py-24"
    >
      <SectionNumber index={index} total={total} className="block" />
      <h2 id="currently-building-heading" className="mt-4 font-display text-4xl text-text">
        Currently building
      </h2>
      <div className="mt-12 space-y-12">
        {BUILDS.map((build) => (
          <article key={build.name} className="border-l border-border pl-6">
            <div className="flex items-center gap-3">
              <StatusDot status={build.status} />
              <h3 className="font-display text-2xl text-text">{build.name}</h3>
            </div>
            <p className="mt-4 text-text">{build.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {build.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs uppercase tracking-widest text-muted border border-border px-2 py-1"
                >
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
