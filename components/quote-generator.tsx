"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, TrashIcon, FileDown } from "lucide-react"

interface QuoteItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export function QuoteGenerator() {
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [items, setItems] = useState<QuoteItem[]>([])

  const [newItemDescription, setNewItemDescription] = useState("")
  const [newItemQuantity, setNewItemQuantity] = useState("1")
  const [newItemUnitPrice, setNewItemUnitPrice] = useState("")

  const handleAddItem = () => {
    if (!newItemDescription || !newItemQuantity || !newItemUnitPrice) return

    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: newItemDescription,
      quantity: Number.parseInt(newItemQuantity),
      unitPrice: Number.parseFloat(newItemUnitPrice),
    }

    setItems([...items, newItem])

    // Reset form
    setNewItemDescription("")
    setNewItemQuantity("1")
    setNewItemUnitPrice("")
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.quantity * item.unitPrice, 0)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  const generateQuote = () => {
    if (!clientName || !clientPhone || items.length === 0) {
      alert("Preencha todos os campos e adicione pelo menos um item ao orçamento.")
      return
    }

    const today = new Date().toLocaleDateString("pt-BR")
    const total = calculateTotal()

    let content = `ORÇAMENTO\n`
    content += `==========\n\n`
    content += `Data: ${today}\n\n`
    content += `CLIENTE\n`
    content += `Nome: ${clientName}\n`
    content += `Telefone: ${clientPhone}\n\n`
    content += `ITENS\n`
    content += `=====\n\n`

    items.forEach((item, index) => {
      content += `${index + 1}. ${item.description}\n`
      content += `   Quantidade: ${item.quantity}\n`
      content += `   Valor Unitário: ${formatCurrency(item.unitPrice)}\n`
      content += `   Subtotal: ${formatCurrency(item.quantity * item.unitPrice)}\n\n`
    })

    content += `==========\n`
    content += `VALOR TOTAL: ${formatCurrency(total)}\n\n`
    content += `Orçamento válido por 15 dias.\n`
    content += `Prazo de entrega a combinar.\n`
    content += `Forma de pagamento: 50% na aprovação e 50% na entrega.\n\n`
    content += `Atenciosamente,\n`
    content += `Esquadrias de Alumínio Ltda.\n`

    // Create a blob and download
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Orcamento_${clientName.replace(/\s+/g, "_")}_${today.replace(/\//g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Orçamento Rápido</CardTitle>
          <CardDescription>Crie um orçamento para seu cliente</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente</Label>
                <Input
                  id="clientName"
                  placeholder="Nome completo"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  placeholder="(00) 00000-0000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Adicionar Item</Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Input
                  placeholder="Descrição do item"
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                />
                <Input
                  type="number"
                  min="1"
                  placeholder="Quantidade"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Valor unitário (R$)"
                  value={newItemUnitPrice}
                  onChange={(e) => setNewItemUnitPrice(e.target.value)}
                />
              </div>
              <Button onClick={handleAddItem} className="w-full">
                <PlusIcon className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </div>

            {items.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Valor Unit.</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.quantity * item.unitPrice)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                            <TrashIcon className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-lg font-semibold">Total: {formatCurrency(calculateTotal())}</div>
          <Button onClick={generateQuote} disabled={!clientName || !clientPhone || items.length === 0}>
            <FileDown className="mr-2 h-4 w-4" />
            Gerar Orçamento
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
