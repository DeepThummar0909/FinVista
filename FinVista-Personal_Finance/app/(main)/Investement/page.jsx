import { getUserInvestments } from "@/actions/investment";
import { InvestmentDashboard } from "./_components/investment-dashboard";

export default async function InvestementPage() {
  const investments = await getUserInvestments();
  return <InvestmentDashboard initialInvestments={investments} />;
}