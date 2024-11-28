import ClientRepository from "@/repositories/client.repository";
import { GetClientsParams } from "@/types";

export default class APIClientService {
  static async deleteClient(id: string, companyId: string) {
    return await ClientRepository.deleteClient(id, companyId);
  }

  static async getAll(companyId: string, params?: GetClientsParams) {
    return await ClientRepository.getAll(companyId, params);
  }
}