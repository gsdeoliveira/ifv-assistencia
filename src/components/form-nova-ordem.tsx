"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type FormData, formSchema } from "@/lib/schemas";
import { FormEtapaAparelho } from "./form-etapa-aparelho";
import { FormEtapaCliente } from "./form-etapa-cliente";

export function FormNovaOrdem() {
  const [etapa, setEtapa] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCliente: "",
      telefone: "",
      email: "",
      marca: "",
      modelo: "",
      defeitoRelatado: "",
    },
    mode: "onTouched",
  });

  function processarFormulario(data: FormData) {
    console.log("DADOS FINAIS:", data);
    toast.success("Ordem de serviço cadastrada com sucesso!");
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
      <h2>{etapa === 0 ? "Informações do Cliente" : "Detalhes do Aparelho"}</h2>
      <form onSubmit={form.handleSubmit(processarFormulario)}>
        {etapa === 0 && <FormEtapaCliente form={form} />}
        {etapa === 1 && <FormEtapaAparelho form={form} />}

        {etapa < 1 && (
          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={proximaEtapa}>
              Avançar
            </Button>
          </div>
        )}
        <div className="mt-4 ml-auto flex justify-between">
          {etapa > 0 && (
            <Button type="button" variant="outline" onClick={etapaAnterior}>
              Voltar
            </Button>
          )}

          {etapa === 1 && <Button type="submit">Cadastrar</Button>}
        </div>
      </form>
    </div>
  );
}
