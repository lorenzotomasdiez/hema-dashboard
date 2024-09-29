import { NextRequest, NextResponse } from "next/server"
import { CreateCompanyDTO } from "@/types/company";
import { APICompanyService } from "@/services/api";
import { getUserAuth } from "@/lib/auth/utils";

export async function POST(req: NextRequest) {
  const { session } = await getUserAuth();
  if (!session) return new Response("Error", { status: 400 });

  const body = await req.json() as CreateCompanyDTO;

  const { name } = body

  try {
    const company = await APICompanyService.findCompanyByNameAndEmail(name, session.user.email as string);

    if (company) {
      return NextResponse.json({ error: "Company already exists" }, { status: 400 });
    }

    const newCompany = await APICompanyService.ownerCreateCompany(name, session.user.id);

    return NextResponse.json(newCompany);

  } catch (error) {
    return NextResponse.json({ error: "Error creating company" }, { status: 500 });
  }
}
