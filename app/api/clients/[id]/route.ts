import { getUserAuth } from "@/lib/auth/utils";
import { Client } from "@/types";
import { db } from "@/lib/db/index";
import { APIClientService, APIUserService } from "@/services/api";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { validateCompanyAccess } from "@/guard";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });
  if (!session.user.selectedCompany) return new Response("No company selected", { status: 400 });

  const id = params.id;

  const body = (await request.json()) as Partial<Client & { ordersTotal: number }>;

  const { id: _, ordersTotal, ...updatedData } = body;


  const client = await db.client.update({
    where: { id, companyId: session.user.selectedCompany.id },
    data: {
      ...updatedData,
    }
  });


  return Response.json(client, { status: 200 });
}


export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getUserAuth();
  const { isValid, error, isAdmin, companyId } = await validateCompanyAccess(session);
  
  if (!isValid) {
    return NextResponse.json({ error }, { status: 401 });
  }

  if(!isAdmin) {
    return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
  }

  try {
    const res = await APIClientService.deleteClient(params.id, companyId as string);
    return Response.json(res, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}