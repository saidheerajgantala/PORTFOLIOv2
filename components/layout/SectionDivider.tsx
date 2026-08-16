'use client';

interface SectionDividerProps {
  label?: string;
  sectionId?: string;
}

export function SectionDivider({ label, sectionId }: SectionDividerProps) {
  const decorative = !label && !sectionId;
  if (decorative) {
    return (
      <hr
        aria-hidden="true"
        className="my-24 border-0 border-t border-border"
      />
    );
  }
  return (
    <div className="my-24 border-b border-border pb-3">
      <div className="flex justify-between font-mono text-xs uppercase tracking-widest mb-3">
        {label && <span className="text-text">{label}</span>}
        {sectionId && <span className="text-muted">{sectionId}</span>}
      </div>
    </div>
  );
}
