import { getUserAuth } from "@/lib/auth/utils";
import { APIInvitationService } from "@/services/api";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = params;
  if (!id) return NextResponse.json({ error: "Invitation ID is required" }, { status: 400 });
  
  try {
    const invitation = await APIInvitationService.findInvitationById(id);
    
    if (!invitation) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    

    const invitationEmailValid = invitation.email === session.user.email;
    if (!invitationEmailValid) return NextResponse.json({ error: "You can only accept your own invitations" }, { status: 400 });

    const res = await APIInvitationService.acceptInvitation(id, session.user.id, invitation.companyId, invitation.role);
    
    return NextResponse.json({
      success: true,
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}