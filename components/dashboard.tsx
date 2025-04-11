"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RevenueModule } from "@/components/revenue-module";
import { CostsModule } from "@/components/costs-module";
import { ProfitModule } from "@/components/profit-module";
import { QuoteGenerator } from "@/components/quote-generator";
import { FinancialSummary } from "@/components/financial-summary";
import { type Revenue, type Cost, useLocalStorage } from "@/lib/storage";

export default function Dashboard() {
  const [revenues, setRevenues] = useLocalStorage<Revenue[]>("revenues", []);
  const [costs, setCosts] = useLocalStorage<Cost[]>("costs", []);

  const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costs.reduce((sum, item) => sum + item.amount, 0);
  const profit = totalRevenue - totalCosts;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            💵 ERP • Gestão Administrativa
          </h1>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6">
        <FinancialSummary
          totalRevenue={totalRevenue}
          totalCosts={totalCosts}
          profit={profit}
        />

        <Tabs defaultValue="faturamento" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="custos">Custos</TabsTrigger>
            <TabsTrigger value="lucro">Lucro</TabsTrigger>
            <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
          </TabsList>

          <TabsContent value="faturamento" className="space-y-4">
            <RevenueModule revenues={revenues} setRevenues={setRevenues} />
          </TabsContent>

          <TabsContent value="custos" className="space-y-4">
            <CostsModule costs={costs} setCosts={setCosts} />
          </TabsContent>

          <TabsContent value="lucro" className="space-y-4">
            <ProfitModule revenues={revenues} costs={costs} />
          </TabsContent>

          <TabsContent value="orcamento" className="space-y-4">
            <QuoteGenerator />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
