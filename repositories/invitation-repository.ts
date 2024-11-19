import { db } from "@/lib/db";
import { CreateInvitationDTO } from "@/types";
import { InviteStatus } from "@prisma/client";

export async function createInvitation(invitation: CreateInvitationDTO) {
  const newInvitation = await db.invitation.create({
    data: invitation
  });
  return newInvitation;
}

export async function findInvitationsByEmail(email: string) {
  const invitations = await db.invitation.findMany({
    where: { email, status: { not: InviteStatus.ACCEPTED } },
    include: {
      company: true
    }
  });
  return invitations;
}

export async function acceptInvitation(invitationId: string) {
  const invitation = await db.invitation.update({
    where: { id: invitationId },
    data: { status: InviteStatus.ACCEPTED }
  });
  return invitation;
}

export async function findInvitationById(invitationId: string) {
  const invitation = await db.invitation.findUnique({
    where: { id: invitationId }
  });
  return invitation;
}