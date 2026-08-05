export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col text-clay-800 p-6">
      {children}
    </div>
  );
}
