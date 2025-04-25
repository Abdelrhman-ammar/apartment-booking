import { getApartmentById } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackIcon, CheckIcon } from "@/components/Icons";

interface ApartmentDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApartmentDetailPage({params}: ApartmentDetailPageProps) {
  const resolvedParams = await params
  const { id } = resolvedParams
  const Id = Number(id)


  if (isNaN(Id)) {
    notFound();
  }

  const { data: apartment, status } = await getApartmentById(Id);

  if (!apartment || status !== 200) {
    notFound();
  }

  // const mainImage = apartment.images && apartment.images.length > 0
  //   ? apartment.images[0]
  //   : 'https://placehold.co/1200x800?text=No+Image';
  const mainImage = 'https://placehold.co/1200x800?text=No+Image';

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center text-foreground hover:text-primary mb-6"
      >
        <BackIcon />
        Back to Listings
      </Link>

      <div className="bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={mainImage}
            alt={apartment.unitName}
            width={1200}
            height={800}
            style={{ objectFit: "cover", width: '100%', height: '100%' }}
            priority
          />
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {apartment.unitName}
              </h1>
              <p className="text-foreground/70 text-lg mb-2">{apartment.location}</p>
              {apartment.project && (
                <p className="text-foreground/70">Project: {apartment.project}</p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-2xl font-bold text-primary">
                ${apartment.price.toLocaleString()}
              </p>
              <p className="text-foreground/70">
                {apartment.available ? "Available" : "Not Available"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-3">Description</h2>
            <p className="text-foreground/80">{apartment.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-background border border-foreground/10 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Details</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-foreground/70">Unit Number</span>
                  <span className="font-medium">{apartment.unitNumber}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-foreground/70">Bedrooms</span>
                  <span className="font-medium">{apartment.bedrooms}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-foreground/70">Bathrooms</span>
                  <span className="font-medium">{apartment.bathrooms}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-foreground/70">Area</span>
                  <span className="font-medium">{apartment.area} m</span>
                </li>
              </ul>
            </div>

            {apartment.features && apartment.features.length > 0 && (
              <div className="bg-background border border-foreground/10 rounded-lg p-4 md:col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-2">Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {apartment.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckIcon />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {apartment.images && apartment.images.length > 1 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {apartment.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-40 rounded-lg overflow-hidden">
                    <Image
                      src={mainImage}
                      alt={`${apartment.unitName} - Image ${index + 2}`}
                      width={600}
                      height={400}
                      style={{ objectFit: "cover", width: '100%', height: '100%' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {apartment.owner && (
            <div className="bg-accent/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Contact Information
              </h2>
              <p className="mb-2">
                <span className="font-medium">Owner:</span> {apartment.owner.name}
              </p>
              <p className="mb-4">
                <span className="font-medium">Email:</span> {apartment.owner.email}
              </p>
              <Link
                href={`mailto:${apartment.owner.email}?subject=Inquiry about ${apartment.unitName}`}
                className="inline-block bg-primary text-background py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
              >
                Contact Owner
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
