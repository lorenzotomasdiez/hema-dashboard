import { API_ROUTES } from "@/lib/api/routes";
import { responseHandler } from "../request";
import { UserRole } from "@prisma/client";
import { InvitationWithCompanies } from "@/types";

export const getInvitations = async (): Promise<InvitationWithCompanies[]> => {
  const res = await fetch(API_ROUTES.invitations.root);
  return await responseHandler(res);
}

export const inviteUser = async (email: string, role: UserRole) => {
  const res = await fetch(API_ROUTES.invitations.inviteUser, {
    method: 'POST',
    body: JSON.stringify({ email, role })
  });
  return await responseHandler(res);
}

export const acceptInvitation = async (invitationId: string): Promise<{ success: boolean, message: string, error?: string }> => {
  const res = await fetch(API_ROUTES.invitations.acceptInvitation(invitationId), {
    method: 'POST'
  });
  return await responseHandler(res);
}