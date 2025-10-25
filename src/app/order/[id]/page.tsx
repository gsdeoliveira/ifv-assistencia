"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Contact,
  DollarSign,
  Loader2,
  Package,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type FinancialEntry,
  getFinancialEntries,
  getOrderById,
  type OrderWithClient,
  saveFinancialEntries,
} from "@/lib/order-service";
import { cn } from "@/lib/utils";

export default function OrderDetailPage() {
  const [order, setOrder] = useState<OrderWithClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    type: "Receita" as "Receita" | "Custo",
    description: "",
    amount: "",
  });

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (!id) return;

    async function fetchOrderAndEntries() {
      setIsLoading(true);
      setNotFound(false);
      const fetchedOrder = await getOrderById(id);

      if (fetchedOrder) {
        setOrder(fetchedOrder);
        const fetchedEntries = await getFinancialEntries(id);
        setEntries(fetchedEntries);
      } else {
        setNotFound(true);
      }
      setIsLoading(false);
    }

    fetchOrderAndEntries();
  }, [id]);

  const handleAddEntry = async () => {
    const amountNumber = parseFloat(newEntry.amount);
    if (!newEntry.description || !amountNumber || amountNumber <= 0) {
      toast.error("Por favor, preencha a descrição e um valor válido.");
      return;
    }

    const entryToAdd: FinancialEntry = {
      id: crypto.randomUUID(),
      type: newEntry.type,
      description: newEntry.description,
      amount: amountNumber,
    };

    const newEntries = [...entries, entryToAdd];
    const oldEntries = entries;
    setEntries(newEntries);
    setNewEntry({ type: "Receita", description: "", amount: "" });

    const response = await saveFinancialEntries(id, newEntries);
    if (!response.success) {
      toast.error("Erro ao salvar o lançamento. Tente novamente.");
      setEntries(oldEntries);
    }
  };

  const removeEntry = async (entryId: string) => {
    const newEntries = entries.filter((entry) => entry.id !== entryId);
    const oldEntries = entries;
    setEntries(newEntries);

    const response = await saveFinancialEntries(id, newEntries);
    if (!response.success) {
      toast.error("Erro ao remover o lançamento. Tente novamente.");
      setEntries(oldEntries);
    }
  };

  const financials = useMemo(() => {
    const totalReceita = entries
      .filter((e) => e.type === "Receita")
      .reduce((acc, e) => acc + e.amount, 0);

    const totalCusto = entries
      .filter((e) => e.type === "Custo")
      .reduce((acc, e) => acc + e.amount, 0);

    const lucroLiquido = totalReceita - totalCusto;

    return { totalReceita, totalCusto, lucroLiquido };
  }, [entries]);

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card className="border-destructive">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle className="mt-4 text-destructive">
              Ordem Não Encontrada
            </CardTitle>
            <CardDescription>
              A ordem de serviço com o ID "{id}" não foi encontrada.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" className="mb-4" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Ordem de Serviço</CardTitle>
              <CardDescription>
                ID: <span className="font-mono text-xs">{order.id}</span>
              </CardDescription>
            </div>
            <Badge
              className={cn(
                "text-sm",
                order.status === "Em Andamento" && "bg-blue-400",
                order.status === "Concluído" && "bg-green-400",
                order.status === "Ag. Retirada" && "bg-yellow-400",
              )}
              variant="secondary"
            >
              {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              Criado em:{" "}
              {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                locale: ptBR,
              })}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Contact className="h-6 w-6" />
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{order.client.nomeCliente}</p>
            <p className="text-muted-foreground">{order.client.telefone}</p>
            <p className="text-muted-foreground">{order.client.email}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <Package className="h-6 w-6" />
            <CardTitle>Aparelho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">
              {order.tipoAparelho} {order.marca} {order.modelo}
            </p>
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Defeito:</span>{" "}
              {order.defeitoRelatado}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="my-4">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <DollarSign className="h-6 w-6" />
          <CardTitle>Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-2 md:flex-row">
            <Select
              value={newEntry.type}
              onValueChange={(value) =>
                setNewEntry({
                  ...newEntry,
                  type: value as "Receita" | "Custo",
                })
              }
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Custo">Custo</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Descrição (ex: Troca de Tela, Peça X)"
              value={newEntry.description}
              onChange={(e) =>
                setNewEntry({ ...newEntry, description: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Valor (R$)"
              value={newEntry.amount}
              onChange={(e) =>
                setNewEntry({ ...newEntry, amount: e.target.value })
              }
              className="w-full md:w-[150px]"
            />
            <Button onClick={handleAddEntry} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[50px]">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      Nenhum lançamento adicionado.
                    </TableCell>
                  </TableRow>
                )}
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <Badge
                        variant={
                          entry.type === "Receita" ? "default" : "destructive"
                        }
                        className={cn(
                          entry.type === "Receita" && "bg-green-600",
                        )}
                      >
                        {entry.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-mono",
                        entry.type === "Receita"
                          ? "text-green-600"
                          : "text-destructive",
                      )}
                    >
                      {entry.type === "Receita" ? "+" : "-"}
                      {formatCurrency(entry.amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEntry(entry.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex flex-col items-end space-y-2">
          <div className="flex w-full justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <TrendingUp className="mr-2 h-4 w-4 text-green-600" />
              Total de Receitas:
            </span>
            <span className="font-mono font-medium text-green-600">
              {formatCurrency(financials.totalReceita)}
            </span>
          </div>
          <div className="flex w-full justify-between text-sm">
            <span className="flex items-center text-muted-foreground">
              <TrendingDown className="mr-2 h-4 w-4 text-destructive" />
              Total de Custos:
            </span>
            <span className="font-mono font-medium text-destructive">
              {formatCurrency(financials.totalCusto)}
            </span>
          </div>
          <div className="flex w-full justify-between border-t pt-2">
            <span>Lucro Líquido:</span>
            <span
              className={cn(
                "font-mono",
                financials.lucroLiquido >= 0
                  ? "text-green-600"
                  : "text-destructive",
              )}
            >
              {formatCurrency(financials.lucroLiquido)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
