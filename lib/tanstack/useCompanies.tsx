import { createCompany, getCompanyInfo, getMyCompanies } from "@/services/companies";
import { CompanyInfo, CompanyWithUserCompanies, CreateCompanyDTO } from "@/types/company";
import { UserRole } from "@prisma/client";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCompaniesQuery = () => {
  return useQuery<CompanyWithUserCompanies[]>({
    queryKey: ["companies"],
    queryFn: getMyCompanies,
    staleTime: 1000 * 60
  });
};

interface UseCompanyMutationProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  queryClient: QueryClient;
}

export const CompanyAddMutation = ({ onSuccess, onError, queryClient }: UseCompanyMutationProps) => {
  return useMutation({
    mutationKey: ["createCompany"],
    mutationFn: (company: CreateCompanyDTO) => createCompany(company),
    onMutate: (company: CreateCompanyDTO) => {
      const previousData = queryClient.getQueryData<CompanyWithUserCompanies[]>(["companies"]);
      const newCompany: CompanyWithUserCompanies = {
        ...company,
        id: new Date().getTime().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userCompanies: [
          {
            id: 1,
            userId: "1",
            companyId: "1",
            role: UserRole.COMPANY_OWNER,
            isEnabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        image: null,
        deletedAt: null
      };
      queryClient.setQueryData<CompanyWithUserCompanies[]>(["companies"], (oldData) => oldData ? [...oldData, newCompany] : [newCompany]);
      return { previousData };
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["companies"], context?.previousData);
      toast.error("Error al crear la empresa");
      onError?.(error);
    },
    onSuccess: () => {
      toast.success("Empresa creada exitosamente");
      onSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    }
  })
}

export const useCompanyInfoQuery = () => {
  return useQuery<CompanyInfo>({
    queryKey: ["companyInfo"],
    queryFn: getCompanyInfo,
    staleTime: 1000 * 60
  });
}
