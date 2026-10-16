import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CompanyLogo, CompanyLogosResponse, LogoVariant } from "@shared/company-branding";

export const COMPANY_LOGOS_QUERY_KEY = ["/api/company-logos"] as const;

export function useCompanyLogos() {
  const query = useQuery<CompanyLogosResponse>({
    queryKey: COMPANY_LOGOS_QUERY_KEY,
    queryFn: async () => (await apiRequest("GET", "/api/company-logos")).json(),
  });

  const saveMutation = useMutation({
    mutationFn: async ({ company, variant, dataUrl }: { company: string; variant: LogoVariant; dataUrl: string }) => {
      const path = `/api/company-logos/${encodeURIComponent(company)}/${variant}`;
      return (await apiRequest("PUT", path, { dataUrl })).json() as Promise<CompanyLogosResponse>;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(COMPANY_LOGOS_QUERY_KEY, response);
    },
  });

  const resetMutation = useMutation({
    mutationFn: async ({ company, variant }: { company: string; variant: LogoVariant }) => {
      const path = `/api/company-logos/${encodeURIComponent(company)}/${variant}`;
      return (await apiRequest("DELETE", path)).json() as Promise<CompanyLogosResponse>;
    },
    onSuccess: (response) => {
      queryClient.setQueryData(COMPANY_LOGOS_QUERY_KEY, response);
    },
  });

  const findLogo = (company: string, variant: LogoVariant): CompanyLogo | undefined =>
    query.data?.logos.find((logo) => logo.company === company && logo.variant === variant);

  return {
    ...query,
    findLogo,
    saveLogo: saveMutation.mutateAsync,
    resetLogo: resetMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    isResetting: resetMutation.isPending,
  };
}
