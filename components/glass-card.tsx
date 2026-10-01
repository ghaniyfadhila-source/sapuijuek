export function GlassCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
