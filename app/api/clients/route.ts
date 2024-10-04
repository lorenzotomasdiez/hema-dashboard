import { createClientSchema } from "@/dto/client/create-client.dto";
import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { formatZodError } from "@/lib/utils";
import { CreateClientType } from "@/types";
import { NextResponse } from "next/server";


export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await db.client.findMany();
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const body = (await req.json()) as CreateClientType;

  const newClientDTO = createClientSchema.safeParse(body);

  if (!newClientDTO.success) {
    return NextResponse.json(formatZodError(newClientDTO.error), { status: 422 });
  }

  const client = await db.client.create({
    data: {
      ...body,
      companyId: session.user.selectedCompany.id
    }
  });

  return NextResponse.json(client, { status: 201 });
}