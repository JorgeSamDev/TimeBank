type ComingSoonCardProps = {
  title: string;
  description: string;
};

export function ComingSoonCard({ title, description }: ComingSoonCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-dashed border-border p-4">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}