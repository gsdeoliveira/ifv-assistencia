"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { NovaOrdemButton } from "@/components/nova-ordem-button";
import { OrdensRecentes } from "@/components/ordens-recentes";
import { StatCards } from "@/components/stats-cards";
import {
  getOrdersWithClientDetails,
  type OrderWithClient,
} from "@/lib/order-service";

export default function Home() {
  const [orders, setOrders] = useState<OrderWithClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const handleOrderCreatedAndRedirect = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  const emAndamentoCount = orders.filter(
    (o) => o.status === "Em Andamento",
  ).length;
  const concluidosCount = orders.filter((o) => o.status === "Concluído").length;

  return (
    <div className="container mx-auto p-2 md:p-5">
      <StatCards
        emAndamentoCount={emAndamentoCount}
        concluidosCount={concluidosCount}
      />
      <OrdensRecentes orders={orders} isLoading={isLoading} />
      <NovaOrdemButton onOrderCreated={handleOrderCreatedAndRedirect} />
    </div>
  );
}
