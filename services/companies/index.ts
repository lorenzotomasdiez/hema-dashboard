import { API_ROUTES } from "@/lib/api/routes";
import { CreateCompanyDTO } from "@/types/company";

export const getMyCompanies = async () => {
  const res = await fetch(API_ROUTES.companies.root);
  const data = await res.json();
  return data;
}

export const createCompany = async (company: CreateCompanyDTO) => {
  const res = await fetch(API_ROUTES.companies.create, {
    method: "POST",
    body: JSON.stringify(company)
  });
  const data = await res.json();
  return data;
}

export const getCompanyInfo = async () => {
  const res = await fetch(API_ROUTES.companies.info);
  const data = await res.json();
  return data;
}
