import BusinessSearchAndFilter from "../BusinessSearchAndFilter";
import YourBusinessesPageContent from "../../../businesses/YourBusinessesPageContent";

export default async function AdminBusinessesPage({ searchParams }: { searchParams: Promise<{ viewMode?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const isInternalUserView = resolvedSearchParams.viewMode === "internal";

  return (
    <div className="flex-1 p-6">
      {isInternalUserView ? (
        <YourBusinessesPageContent />
      ) : (
        <>
          <h1 className="font-display text-2xl font-semibold text-foreground">All Businesses</h1>
          <p className="mt-4 text-clay-700">View and manage all businesses in the system.</p>
          <BusinessSearchAndFilter />
        </>
      )}
    </div>
  );
}
