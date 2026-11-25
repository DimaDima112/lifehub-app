export default function EmptyState({ icon, title, hint }: { icon: string; title: string; hint?: string }) {
  return (
    <div className="text-center py-10 text-gray-500">
      <div className="text-5xl mb-2">{icon}</div>
      <p className="font-medium text-gray-700">{title}</p>
      {hint && <p className="text-sm mt-1">{hint}</p>}
    </div>
  );
}
