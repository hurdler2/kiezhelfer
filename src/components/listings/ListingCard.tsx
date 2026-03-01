import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { formatPrice, formatRelativeTime } from "@/lib/utils";
import type { ListingWithDetails } from "@/types";

interface ListingCardProps {
  listing: ListingWithDetails;
  locale?: string;
}

export default function ListingCard({ listing, locale = "de" }: ListingCardProps) {
  const categoryNames: Record<string, Record<string, string>> = {
    de: {
      "home-repair": "Hausreparatur",
      cleaning: "Reinigung",
      "it-help": "IT-Hilfe",
      tutoring: "Nachhilfe",
      babysitting: "Kinderbetreuung",
      moving: "Umzug",
      gardening: "Garten",
      cooking: "Kochen",
      beauty: "Schönheit",
      other: "Sonstiges",
    },
    en: {
      "home-repair": "Home Repair",
      cleaning: "Cleaning",
      "it-help": "IT Help",
      tutoring: "Tutoring",
      babysitting: "Babysitting",
      moving: "Moving",
      gardening: "Gardening",
      cooking: "Cooking",
      beauty: "Beauty",
      other: "Other",
    },
  };

  const categoryLabel =
    categoryNames[locale]?.[listing.category.slug] ?? listing.category.slug;

  return (
    <Link href={`/${locale}/listings/${listing.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all overflow-hidden group">
        {/* Image placeholder */}
        <div className="h-24 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center relative overflow-hidden">
          {listing.imageUrls.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={listing.imageUrls[0]}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-2xl opacity-50">
              {listing.category.iconName === "Wrench" ? "🔧" :
               listing.category.iconName === "Sparkles" ? "✨" :
               listing.category.iconName === "Monitor" ? "💻" :
               listing.category.iconName === "BookOpen" ? "📚" :
               listing.category.iconName === "Baby" ? "👶" :
               listing.category.iconName === "Truck" ? "🚚" :
               listing.category.iconName === "Leaf" ? "🌿" :
               listing.category.iconName === "ChefHat" ? "👨‍🍳" :
               listing.category.iconName === "Scissors" ? "✂️" : "🤝"}
            </span>
          )}
          <Badge variant="info" className="absolute top-1.5 left-1.5 text-xs py-0 px-1.5">
            {categoryLabel}
          </Badge>
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-0.5">{listing.title}</h3>
          <p className="text-xs text-gray-500 line-clamp-1 mb-2">{listing.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-700">
              {formatPrice(listing.priceType, listing.priceAmount, locale)}
            </span>
            {listing.averageRating > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-gray-500">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{listing.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <Avatar
                src={listing.user.profile?.avatarUrl}
                name={listing.user.name}
                size="sm"
              />
              <span className="text-xs text-gray-600 truncate max-w-[70px]">
                {listing.user.name}
              </span>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-gray-400">
              {listing.district && (
                <>
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[60px]">{listing.district}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
