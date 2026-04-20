import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import EmailVerifyBanner from "@/components/profile/EmailVerifyBanner";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";

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
    // emailVerifiedAt included automatically
  });

  if (!user) redirect(`/${params.locale}/login`);

  const tAuth = await getTranslations("auth");

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("editTitle")}</h1>

      {!user.emailVerifiedAt && <EmailVerifyBanner />}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
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

      {user.passwordHash && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{tAuth("changePasswordTitle")}</h2>
          <ChangePasswordForm />
        </div>
      )}

      <div className="bg-white rounded-xl border border-red-100 p-6">
        <h2 className="text-base font-semibold text-red-700 mb-1">{t("deleteAccountTitle")}</h2>
        <p className="text-sm text-gray-500 mb-4">{t("deleteAccountDesc")}</p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
