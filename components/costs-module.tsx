"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Cost } from "@/lib/storage"
import { PlusIcon, TrashIcon } from "lucide-react"

interface CostsModuleProps {
  costs: Cost[]
  setCosts: (costs: Cost[]) => void
}

export function CostsModule({ costs, setCosts }: CostsModuleProps) {
  const [date, setDate] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !category || !description || !amount) return

    const newCost: Cost = {
      id: Date.now().toString(),
      date,
      category,
      description,
      amount: Number.parseFloat(amount),
      createdAt: new Date().toISOString(),
    }

    setCosts([...costs, newCost])

    // Reset form
    setDate("")
    setCategory("")
    setDescription("")
    setAmount("")
  }

  const handleDelete = (id: string) => {
    setCosts(costs.filter((cost) => cost.id !== id))
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
          <CardTitle>Adicionar Custo</CardTitle>
          <CardDescription>Registre despesas como material, mão de obra, frete e custos fixos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material (Alumínio, Vidro)</SelectItem>
                    <SelectItem value="mao-de-obra">Mão de Obra</SelectItem>
                    <SelectItem value="frete">Frete</SelectItem>
                    <SelectItem value="custos-fixos">Custos Fixos</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o custo..."
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
              Adicionar Custo
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Custos</CardTitle>
          <CardDescription>Todas as despesas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          {costs.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum custo registrado</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costs.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{formatDate(cost.date)}</TableCell>
                      <TableCell>
                        {cost.category === "material" && "Material"}
                        {cost.category === "mao-de-obra" && "Mão de Obra"}
                        {cost.category === "frete" && "Frete"}
                        {cost.category === "custos-fixos" && "Custos Fixos"}
                        {cost.category === "outros" && "Outros"}
                      </TableCell>
                      <TableCell>{cost.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(cost.amount)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cost.id)}>
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
