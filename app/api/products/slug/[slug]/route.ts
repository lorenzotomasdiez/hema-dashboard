import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db/index";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });

  const slug = params.slug;

  const product = await db.product.findUnique({
    where: { companyId_slug: { companyId: session.user.selectedCompany.id, slug } },
    include: {
      costComponents: true,
    }
  });

  return NextResponse.json(product, { status: 200 });
}
