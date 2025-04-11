"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Revenue } from "@/lib/storage"
import { PlusIcon, TrashIcon } from "lucide-react"

interface RevenueModuleProps {
  revenues: Revenue[]
  setRevenues: (revenues: Revenue[]) => void
}

export function RevenueModule({ revenues, setRevenues }: RevenueModuleProps) {
  const [date, setDate] = useState("")
  const [client, setClient] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !client || !description || !amount) return

    const newRevenue: Revenue = {
      id: Date.now().toString(),
      date,
      client,
      description,
      amount: Number.parseFloat(amount),
      createdAt: new Date().toISOString(),
    }

    setRevenues([...revenues, newRevenue])

    // Reset form
    setDate("")
    setClient("")
    setDescription("")
    setAmount("")
  }

  const handleDelete = (id: string) => {
    setRevenues(revenues.filter((revenue) => revenue.id !== id))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${day}/${month}/${year}`
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Faturamento</CardTitle>
          <CardDescription>Registre os valores recebidos com data, cliente e descrição</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  placeholder="Nome do cliente"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Serviço/Produto</Label>
              <Textarea
                id="description"
                placeholder="Ex: Janela, Portão, Box..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <PlusIcon className="mr-2 h-4 w-4" />
              Adicionar Faturamento
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Faturamento</CardTitle>
          <CardDescription>Todos os valores recebidos</CardDescription>
        </CardHeader>
        <CardContent>
          {revenues.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum faturamento registrado</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenues.map((revenue) => (
                    <TableRow key={revenue.id}>
                      <TableCell>{formatDate(revenue.date)}</TableCell>
                      <TableCell>{revenue.client}</TableCell>
                      <TableCell>{revenue.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(revenue.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(revenue.id)}>
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
