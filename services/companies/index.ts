import { API_ROUTES } from "@/lib/api/routes";
import { CreateCompanyDTO } from "@/types/company";
import { responseHandler } from "../request";

export const getMyCompanies = async () => {
  const res = await fetch(API_ROUTES.companies.root);
  return await responseHandler(res);
}

export const createCompany = async (company: CreateCompanyDTO) => {
  const res = await fetch(API_ROUTES.companies.create, {
    method: "POST",
    body: JSON.stringify(company)
  });
  return await responseHandler(res);
}

export const getCompanyInfo = async () => {
  const res = await fetch(API_ROUTES.companies.info);
  return await responseHandler(res);
}