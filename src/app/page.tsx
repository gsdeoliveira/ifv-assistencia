"use client";

import { format } from "date-fns";
import { Check, Clock, History, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { FormNovaOrdem } from "@/components/form-nova-ordem";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getOrdersWithClientDetails,
  type OrderWithClient,
} from "@/lib/order-service";
import { cn } from "@/lib/utils";

export default function Home() {
  const [orders, setOrders] = useState<OrderWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    const fetchedOrders = await getOrdersWithClientDetails();
    fetchedOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setOrders(fetchedOrders);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderCreated = useCallback(() => {
    setIsModalOpen(false);
    fetchOrders();
  }, [fetchOrders]);

  const emAndamentoCount = orders.filter(
    (o) => o.status === "Em Andamento",
  ).length;
  const concluidosCount = orders.filter((o) => o.status === "Concluído").length;

  return (
    <>
      <Header />
      <div className="container mx-auto p-2 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
          <Card className="bg-blue-400">
            <CardHeader>
              <CardTitle>Em Andamento</CardTitle>
              <CardDescription className="text-foreground/90">
                Aparelhos sendo reparados
              </CardDescription>
              <CardAction>
                <Clock />
              </CardAction>
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-bold">{emAndamentoCount}</h1>
            </CardContent>
          </Card>
          <Card className="bg-green-400">
            <CardHeader>
              <CardTitle>Concluídos</CardTitle>
              <CardDescription className="text-foreground/90">
                Aparelhos concluídos
              </CardDescription>
              <CardAction>
                <Check />
              </CardAction>
            </CardHeader>
            <CardContent>
              <h1 className="text-3xl font-bold">{concluidosCount}</h1>
            </CardContent>
          </Card>
        </div>
        <div className="mt-2 md:mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Ordens Recentes</CardTitle>
              <CardDescription className="text-foreground/90">
                Últimas ordens de serviço cadastradas
              </CardDescription>
              <CardAction>
                <History />
              </CardAction>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-2">
                {isLoading && (
                  <div className="flex justify-center items-center p-4">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando ordens...
                  </div>
                )}

                {!isLoading && orders.length === 0 && (
                  <div className="flex justify-center items-center p-4 text-muted-foreground">
                    Nenhuma ordem de serviço cadastrada.
                  </div>
                )}

                {!isLoading &&
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="hover:bg-accent space-y-2 p-2 rounded-md border"
                    >
                      <div className="flex justify-between items-center">
                        <h2>{order.client.nomeCliente}</h2>
                        <Badge
                          className={cn(
                            order.status === "Em Andamento" && "bg-blue-400",
                            order.status === "Concluído" && "bg-green-400",
                            order.status === "Ag. Retirada" && "bg-yellow-400",
                          )}
                          variant="secondary"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <p>
                          {order.tipoAparelho} {order.marca} {order.modelo}
                        </p>
                        <p>{format(new Date(order.createdAt), "dd/MM/yyyy")}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Defeito: {order.defeitoRelatado}
                      </p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto mt-2 md:mt-5 flex items-center gap-2 bg-foreground">
                Adicionar novo registro
                <Plus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Ordem de Serviço</DialogTitle>
              </DialogHeader>
              <FormNovaOrdem onOrderCreated={handleOrderCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
