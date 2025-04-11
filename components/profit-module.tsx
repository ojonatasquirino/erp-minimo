"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Revenue, Cost } from "@/lib/storage"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ProfitModuleProps {
  revenues: Revenue[]
  costs: Cost[]
}

export function ProfitModule({ revenues, costs }: ProfitModuleProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  // Calculate monthly data
  const getMonthlyData = () => {
    const monthlyData: Record<string, { month: string; revenue: number; costs: number; profit: number }> = {}

    // Process revenues
    revenues.forEach((revenue) => {
      const month = revenue.date.substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { month, revenue: 0, costs: 0, profit: 0 }
      }
      monthlyData[month].revenue += revenue.amount
    })

    // Process costs
    costs.forEach((cost) => {
      const month = cost.date.substring(0, 7) // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { month, revenue: 0, costs: 0, profit: 0 }
      }
      monthlyData[month].costs += cost.amount
    })

    // Calculate profit
    Object.keys(monthlyData).forEach((month) => {
      monthlyData[month].profit = monthlyData[month].revenue - monthlyData[month].costs
    })

    // Convert to array and sort by month
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
  }

  const monthlyData = getMonthlyData()

  // Calculate category data for pie chart
  const getCategoryData = () => {
    const categoryData: Record<string, number> = {
      material: 0,
      "mao-de-obra": 0,
      frete: 0,
      "custos-fixos": 0,
      outros: 0,
    }

    costs.forEach((cost) => {
      categoryData[cost.category] += cost.amount
    })

    return Object.entries(categoryData)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name:
          name === "material"
            ? "Material"
            : name === "mao-de-obra"
              ? "Mão de Obra"
              : name === "frete"
                ? "Frete"
                : name === "custos-fixos"
                  ? "Custos Fixos"
                  : "Outros",
        value,
      }))
  }

  const categoryData = getCategoryData()

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  const formatMonthLabel = (month: string) => {
    const [year, monthNum] = month.split("-")
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    return `${monthNames[Number.parseInt(monthNum) - 1]}/${year.substring(2)}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lucro Mensal</CardTitle>
          <CardDescription>Visualização do faturamento, custos e lucro por mês</CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Sem dados suficientes para gerar o gráfico</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={formatMonthLabel} />
                <YAxis tickFormatter={(value) => `R$${value}`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label) => formatMonthLabel(label as string)}
                />
                <Legend />
                <Bar dataKey="revenue" name="Faturamento" fill="#4ade80" />
                <Bar dataKey="costs" name="Custos" fill="#f87171" />
                <Bar dataKey="profit" name="Lucro" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Custos</CardTitle>
          <CardDescription>Visualização dos custos por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          {categoryData.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Sem dados suficientes para gerar o gráfico</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
