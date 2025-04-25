import { getApartments } from "@/lib/api";
import ApartmentCard from "@/components/ApartmentCard";
import { Apartment } from "@/types/apartment";
import Pagination from "@/components/Pagination";


const APARTMENTS_PER_PAGE = 3;

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const  { page } = await searchParams
  const currentPage = Number(page) || 1;
  const { data: apartments } = await getApartments(currentPage, APARTMENTS_PER_PAGE);

  const hasApartments = apartments && apartments.length > 0;
  const hasNextPage = apartments && apartments.length === APARTMENTS_PER_PAGE;
  const estimatedTotalPages = hasNextPage ? Math.max(currentPage + 1, 2) : currentPage;

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-4">Find Your Perfect Apartment</h1>
      </div>

      {hasApartments ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apartments.map((apartment: Apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>

          <Pagination 
            currentPage={currentPage} 
            totalPages={estimatedTotalPages} 
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-foreground mb-2">No apartments found</h2>
          <p className="text-foreground/70">
            There are no apartments available at the moment. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}
