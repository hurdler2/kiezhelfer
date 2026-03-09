import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ListingForm from "@/components/listings/ListingForm";
import ListingImageUpload from "@/components/listings/ListingImageUpload";

interface Props {
  params: { id: string; locale: string };
}

export default async function EditListingPage({ params }: Props) {
  setRequestLocale(params.locale);
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      description: true,
      categoryId: true,
      district: true,
      priceType: true,
      priceAmount: true,
      tags: true,
      imageUrls: true,
      userId: true,
      status: true,
      latitude: true,
      longitude: true,
    },
  });

  if (!listing || listing.status === "DELETED") {
    notFound();
  }

  const isOwnerOrAdmin =
    session.user.id === listing.userId ||
    (session.user as any).role === "ADMIN";

  if (!isOwnerOrAdmin) {
    notFound();
  }

  const t = await getTranslations("listingForm");
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("editTitle")}</h1>

      {/* Photo management */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Fotos verwalten</p>
        <ListingImageUpload listingId={listing.id} currentImages={listing.imageUrls} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ListingForm
          categories={categories}
          listingId={listing.id}
          defaultValues={{
            title: listing.title,
            description: listing.description,
            categoryId: listing.categoryId,
            district: listing.district ?? undefined,
            priceType: listing.priceType as "free" | "hourly" | "fixed" | "negotiable",
            priceAmount: listing.priceAmount ?? undefined,
            tags: listing.tags.join(", "),
            latitude: listing.latitude ?? undefined,
            longitude: listing.longitude ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
