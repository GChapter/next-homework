interface InformationLineProps {
  title: string;
  context: string;
}

export default function InformationLine({
  title,
  context,
}: InformationLineProps) {
  return (
    <p className="text-xl font-semibold">
      {title} <span className="font-normal">{context}</span>
    </p>
  );
}
