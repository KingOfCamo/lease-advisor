import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  let settings = await prisma.businessSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.businessSettings.create({
      data: { id: "default" },
    });
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your business branding, disclaimer, and preferences"
      />
      <SettingsForm
        initialData={{
          companyName: settings.companyName,
          tagline: settings.tagline,
          licenceNumber: settings.licenceNumber,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          primaryColor: settings.primaryColor,
          disclaimer: settings.disclaimer,
          termsOfEngagement: settings.termsOfEngagement,
        }}
      />
    </div>
  );
}
