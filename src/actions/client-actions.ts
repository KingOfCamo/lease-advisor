"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  const client = await prisma.client.create({
    data: {
      businessName: formData.get("businessName") as string,
      contactPerson: (formData.get("contactPerson") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      clientType: formData.get("clientType") as string,
      abn: (formData.get("abn") as string) || null,
      status: "ACTIVE",
      notes: (formData.get("notes") as string) || null,
    },
  });

  revalidatePath("/clients");
  redirect(`/clients/${client.id}`);
}

export async function updateClient(id: string, formData: FormData) {
  await prisma.client.update({
    where: { id },
    data: {
      businessName: formData.get("businessName") as string,
      contactPerson: (formData.get("contactPerson") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      clientType: formData.get("clientType") as string,
      abn: (formData.get("abn") as string) || null,
      notes: (formData.get("notes") as string) || null,
    },
  });

  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}
