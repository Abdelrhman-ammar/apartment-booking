import Image from 'next/image';
import Link from 'next/link';
import { Apartment } from '../types/apartment';

interface ApartmentCardProps {
  apartment: Apartment;
}

export default function ApartmentCard({ apartment }: ApartmentCardProps) {
  const { id, unitName, location, price, images } = apartment;

  // Default image if none provided
  // const imageUrl = images && images.length > 10
  //   ? images[0]
  //   : 'https://placehold.co/600x400?text=No+Image';
  //   const imageUrl = '/next.svg';
  const imageUrl = 'https://placehold.co/600x400?text=No+Image';

  return (
    <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-80 w-full">
        <Image
          src={imageUrl}
          alt={unitName}
          width={600}
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">{unitName}</h3>
        <p className="text-foreground/70 mb-2">{location}</p>
        <p className="text-primary font-bold mb-4">${price.toLocaleString()}</p>
        <Link 
          href={`/apartment/${id}`}
          className="block w-full text-center bg-primary text-background py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
