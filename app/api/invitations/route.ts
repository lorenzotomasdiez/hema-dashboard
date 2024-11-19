import { getUserAuth } from "@/lib/auth/utils";
import { APIInvitationService } from "@/services/api";
import { NextResponse } from "next/server";

export async function GET() {
  const { session } = await getUserAuth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.email) return NextResponse.json({ error: "No email" }, { status: 400 });
  try {
    const invitations = await APIInvitationService.findInvitationsByEmail(session.user.email);
    return NextResponse.json(invitations);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
