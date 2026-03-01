import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default async function ProfilePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations("profile");
  const session = await auth();

  if (!session?.user) {
    redirect(`/${params.locale}/login`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user) redirect(`/${params.locale}/login`);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("editTitle")}</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProfileEditForm
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            profile: user.profile,
          }}
        />
      </div>
    </div>
  );
}
