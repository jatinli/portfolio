import { FadeIn } from "./Reveal";

/** Editorial section label: mono index + rule + title. */
export default function SectionHeading({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <FadeIn className="flex items-center gap-5 mb-16 md:mb-24">
      <span className="mono-label text-accent">{index}</span>
      <span className="h-px flex-1 max-w-24 bg-line" aria-hidden />
      <span className="mono-label">{label}</span>
    </FadeIn>
  );
}
