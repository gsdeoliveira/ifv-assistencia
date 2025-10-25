import { format } from "date-fns";
import Link from "next/link";
import type { OrderWithClient } from "@/lib/order-service";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface OrderProps {
  order: OrderWithClient;
}

export function Order({ order }: OrderProps) {
  return (
    <Link href={`/order/${order.id}`} prefetch={false}>
      <div className="hover:bg-accent cursor-pointer space-y-2 p-2 rounded-md border">
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
    </Link>
  );
}
