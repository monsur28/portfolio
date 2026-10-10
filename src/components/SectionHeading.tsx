export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  aside,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-[68ch]">
        <p className="eyebrow">
          <span className="text-[var(--color-accent-green)]">{index}</span>
          <span aria-hidden="true" className="mx-3 inline-block h-px w-8 align-middle bg-white/30" />
          {eyebrow}
        </p>
        <h2 className="section-title">{title}</h2>
        {description && (
          <p className="mt-5 text-base md:text-lg leading-relaxed text-[var(--color-dim-text)]">{description}</p>
        )}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
