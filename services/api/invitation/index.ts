import { InvitationRepository } from "@/repositories";
import { CreateInvitationDTO } from "@/types";
import APIResendService from "../resend";
import APIUserService from "../user";
import { UserRole } from "@prisma/client";

export default class APIInvitationService {
  static async createInvitation(invitation: CreateInvitationDTO) {
    const newInvitation = await InvitationRepository.createInvitation(invitation);
    const emailResponse = await APIResendService.sendInvitationEmail(newInvitation);
    return { invitation: newInvitation, emailResponse };
  }

  static async findInvitationsByEmail(email: string) {
    const invitations = await InvitationRepository.findInvitationsByEmail(email);
    return invitations;
  }

  static async findInvitationById(invitationId: string) {
    const invitation = await InvitationRepository.findInvitationById(invitationId);
    return invitation;
  }

  static async acceptInvitation(invitationId: string, userId: string, companyId: string, role?: UserRole) {
    const addUserToCompany = await APIUserService.addUserToCompany(userId, companyId, role);
    const invitation = await InvitationRepository.acceptInvitation(invitationId);
    return { invitation, addUserToCompany };
  }
}
