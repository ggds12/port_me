type SectionNumberProps = { value: string };

export function SectionNumber({ value }: SectionNumberProps) {
  return <span className="section-number" aria-hidden="true">{value}</span>;
}
