'use client';

import { useWhoAmI } from '@/components/entry/whoami-store';
import { SECTION_ORDER } from '@/content/sections';
import type { SectionId } from '@/lib/types';
import { CareerArc } from '@/components/sections/CareerArc';
import { CurrentlyBuilding } from '@/components/sections/CurrentlyBuilding';
import { VenturePortfolio } from '@/components/sections/VenturePortfolio';
import { MultiCloud } from '@/components/sections/MultiCloud';
import { Principles } from '@/components/sections/Principles';
import { Recognition } from '@/components/sections/Recognition';
import { Contact } from '@/components/sections/Contact';

interface SectionProps {
  index: number;
  total: number;
}

function SectionById({ id, index, total }: { id: SectionId; index: number; total: number }) {
  switch (id) {
    case 'career-arc': return <CareerArc index={index} total={total} />;
    case 'currently-building': return <CurrentlyBuilding index={index} total={total} />;
    case 'ventures': return <VenturePortfolio index={index} total={total} />;
    case 'multi-cloud': return <MultiCloud index={index} total={total} />;
    case 'principles': return <Principles index={index} total={total} />;
    case 'recognition': return <Recognition index={index} total={total} />;
    case 'contact': return <Contact index={index} total={total} />;
    default:
      // hero and other non-resolved IDs handled elsewhere
      return null;
  }
}

export function RoleReshapedPage() {
  const role = useWhoAmI((s) => s.role);
  const order = SECTION_ORDER[role];
  const total = order.length;
  return (
    <>
      {order.map((id, i) => (
        <SectionById key={id} id={id} index={i + 1} total={total} />
      ))}
    </>
  );
}
