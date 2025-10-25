"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/lib/order-service";
import { type FormData, formSchema } from "@/lib/schemas";
import { FormEtapaAparelho } from "./form-etapa-aparelho";
import { FormEtapaCliente } from "./form-etapa-cliente";

interface FormNovaOrdemProps {
  onOrderCreated: (orderId: string) => void;
}

export function FormNovaOrdem({ onOrderCreated }: FormNovaOrdemProps) {
  const [etapa, setEtapa] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCliente: "",
      telefone: "",
      email: "",
      tipoAparelho: undefined,
      marca: "",
      modelo: "",
      defeitoRelatado: "",
    },
    mode: "onSubmit",
  });
  async function processarFormulario(data: FormData) {
    setIsSubmitting(true);
    try {
      const response = await createOrder(data);

      if (response.success) {
        toast.success("Ordem de serviço cadastrada com sucesso!");
        form.reset();
        setEtapa(0);
        const id = response.data?.id;
        if (id) {
          onOrderCreated(id);
        } else {
          toast.error("Algo deu errado ao cadastrar a ordem.");
        }
      } else {
        toast.error(response.error || "Erro ao cadastrar a ordem.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao cadastrar a ordem de serviço.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const proximaEtapa = async () => {
    const fields: (keyof FormData)[] = ["nomeCliente", "telefone", "email"];
    const isEtapaValida = await form.trigger(fields);

    if (isEtapaValida) {
      setEtapa((prev) => prev + 1);
    }
  };

  const etapaAnterior = () => {
    setEtapa((prev) => prev - 1);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 w-full h-1 sm:h-2">
        <div
          className={`w-full h-full rounded-md ${etapa === 0 ? "bg-primary" : "bg-secondary"}`}
        />
        <div
          className={`w-full h-full rounded-md ${etapa === 1 ? "bg-primary" : "bg-secondary"}`}
        />
      </div>
      <form onSubmit={form.handleSubmit(processarFormulario)}>
        <fieldset disabled={isSubmitting}>
          {etapa === 0 && <FormEtapaCliente form={form} />}
          {etapa === 1 && <FormEtapaAparelho form={form} />}
        </fieldset>

        {etapa < 1 && (
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={proximaEtapa}
              disabled={isSubmitting}
            >
              Avançar
            </Button>
          </div>
        )}

        <div className="mt-4 ml-auto flex justify-between">
          {etapa > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={etapaAnterior}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
          )}

          {etapa === 1 && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Cadastrando..." : "Cadastrar Ordem"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
