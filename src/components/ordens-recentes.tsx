import { History, Loader2 } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OrderWithClient } from "@/lib/order-service";
import { Order } from "./order";

interface RecentOrdersListProps {
  orders: OrderWithClient[];
  isLoading: boolean;
}

export function OrdensRecentes({ orders, isLoading }: RecentOrdersListProps) {
  return (
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
          <div className="flex flex-col gap-2">
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
              orders.map((order) => <Order key={order.id} order={order} />)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
