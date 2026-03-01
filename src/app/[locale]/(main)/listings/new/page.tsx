import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ListingForm from "@/components/listings/ListingForm";

export default async function NewListingPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  const t = await getTranslations("listingForm");
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("createTitle")}</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ListingForm categories={categories} />
      </div>
    </div>
  );
}
