import type { FormData } from "@/lib/schemas";

export type Client = {
  id: string;
  nomeCliente: string;
  telefone?: string;
  email?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: string;

  tipoAparelho: "Celular" | "Tablet" | "Notebook" | string;
  marca: string;
  modelo: string;
  defeitoRelatado: string;

  clientId: string;
};

export type OrderWithClient = Order & {
  client: Client;
};

export type FinancialEntry = {
  id: string;
  type: "Receita" | "Custo";
  description: string;
  amount: number;
};

export type ServiceResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

const CLIENTS_KEY = "service-clients";
const ORDERS_KEY = "service-orders";
const FINANCIALS_KEY_PREFIX = "service-financials-"; // service-financials-[orderId]

export async function getClients(): Promise<Client[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  try {
    const clients = JSON.parse(localStorage.getItem(CLIENTS_KEY) || "[]");
    return clients;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
}

export async function createOrder(
  data: FormData,
): Promise<ServiceResponse<Order>> {
  console.log("Chamando serviço FAKE (localStorage) V2 - Relacional...");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const { nomeCliente, telefone, email, ...applianceData } = data;

    const allClients: Client[] = await getClients();
    let client = allClients.find(
      (c) => c.telefone === telefone && c.telefone !== "",
    );
    let clientId: string;

    if (client) {
      clientId = client.id;
    } else {
      client = {
        id: crypto.randomUUID(),
        nomeCliente,
        telefone,
        email,
      };
      allClients.push(client);
      localStorage.setItem(CLIENTS_KEY, JSON.stringify(allClients));
      clientId = client.id;
      console.log("Novo cliente salvo:", client);
    }

    const allOrders: Order[] = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]",
    );

    const newOrder: Order = {
      ...applianceData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "Em Andamento",
      clientId: clientId,
    };

    allOrders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    console.log("Nova ordem salva:", newOrder);
    return { success: true, data: newOrder };
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
    return { success: false, error: "Falha ao salvar dados localmente." };
  }
}

export async function getClientHistory(clientId: string): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  try {
    const allOrders: Order[] = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]",
    );

    const clientOrders = allOrders.filter(
      (order) => order.clientId === clientId,
    );
    console.log(`Histórico encontrado para ${clientId}:`, clientOrders);
    return clientOrders;
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    return [];
  }
}

export async function getOrdersWithClientDetails(): Promise<OrderWithClient[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const allOrders: Order[] = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]",
    );
    const allClients: Client[] = await getClients();

    const ordersWithClient = allOrders.map((order) => {
      const client = allClients.find((c) => c.id === order.clientId);
      return {
        ...order,
        client: client || {
          id: "unknown",
          nomeCliente: "Cliente Não Encontrado",
        },
      };
    });

    return ordersWithClient;
  } catch (error) {
    console.error("Erro ao buscar ordens com clientes:", error);
    return [];
  }
}

export async function getOrderById(
  id: string,
): Promise<OrderWithClient | null> {
  //sawait new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const allOrders: Order[] = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]",
    );
    const order = allOrders.find((o) => o.id === id);

    if (!order) {
      return null;
    }

    const allClients: Client[] = await getClients();
    const client = allClients.find((c) => c.id === order.clientId);

    return {
      ...order,
      client: client || {
        id: "unknown",
        nomeCliente: "Cliente Não Encontrado",
      },
    };
  } catch (error) {
    console.error("Erro ao buscar ordem por ID:", error);
    return null;
  }
}

export async function getFinancialEntries(
  orderId: string,
): Promise<FinancialEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  try {
    const key = `${FINANCIALS_KEY_PREFIX}${orderId}`;
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    return entries;
  } catch (error) {
    console.error("Erro ao buscar lançamentos financeiros:", error);
    return [];
  }
}

export async function saveFinancialEntries(
  orderId: string,
  entries: FinancialEntry[],
): Promise<ServiceResponse<true>> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  try {
    const key = `${FINANCIALS_KEY_PREFIX}${orderId}`;
    localStorage.setItem(key, JSON.stringify(entries));
    return { success: true, data: true };
  } catch (error) {
    console.error("Erro ao salvar lançamentos financeiros:", error);
    return { success: false, error: "Falha ao salvar lançamentos." };
  }
}
