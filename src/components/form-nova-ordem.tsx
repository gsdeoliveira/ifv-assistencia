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

// 1. Definimos a interface de props para receber a função
interface FormNovaOrdemProps {
  onOrderCreated: () => void;
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
        onOrderCreated();
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
      <h2 className="text-xl font-semibold">
        {etapa === 0 ? "Informações do Cliente" : "Detalhes do Aparelho"}
      </h2>
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
