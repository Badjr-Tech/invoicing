export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col text-foreground p-6">
      {children}
    </div>
  );
}
