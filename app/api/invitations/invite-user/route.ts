import { createInvitationSchema } from "@/dto/invitation";
import { getUserAuth } from "@/lib/auth/utils";
import { formatZodError } from "@/lib/utils";
import { APIInvitationService } from "@/services/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.selectedCompany) return NextResponse.json({ error: "No company selected" }, { status: 400 });
  const body = await request.json();
  const invitationDTO = createInvitationSchema.safeParse(body);
  
  if (!invitationDTO.success) {
    return NextResponse.json(formatZodError(invitationDTO.error), { status: 422 });
  }
  
  try {
    const res = await APIInvitationService.createInvitation({
      email: invitationDTO.data.email,
      companyId: session.user.selectedCompany.id,
      role: invitationDTO.data.role
    });
  
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
