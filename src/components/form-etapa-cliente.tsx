"use client";

import { Check, ChevronsUpDown } from "lucide-react";
// 1. Importamos useEffect e useState para buscar os dados
import { useEffect, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Client, getClients } from "@/lib/order-service";
import type { FormData } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { MaskedInput } from "./ui/input-phone-number";

interface FormEtapaClienteProps {
  form: UseFormReturn<FormData>;
}

export function FormEtapaCliente({ form }: FormEtapaClienteProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isExistingClient, setIsExistingClient] = useState(false);

  const [clientes, setClientes] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    async function loadClients() {
      setIsLoadingClients(true);
      const fetchedClients = await getClients();
      setClientes(fetchedClients);
      setIsLoadingClients(false);
    }
    loadClients();
  }, []);

  const filteredClientes = clientes.filter((cliente) =>
    cliente.nomeCliente.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <FieldGroup>
        <Controller
          name="nomeCliente"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="nomeCliente">Nome do Cliente</FieldLabel>
              {/* 5. A lógica do Combobox agora usa os dados do estado */}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[300px] justify-between"
                  >
                    {field.value || "Selecione um cliente..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Procure um cliente..."
                      className="h-9"
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      {isLoadingClients && (
                        <CommandItem disabled>
                          Carregando clientes...
                        </CommandItem>
                      )}
                      {!isLoadingClients &&
                        filteredClientes.map((cliente) => (
                          <CommandItem
                            key={cliente.id}
                            value={cliente.nomeCliente}
                            onSelect={(currentValue) => {
                              setValue(
                                currentValue === value ? "" : currentValue,
                              );

                              form.setValue(
                                "nomeCliente",
                                cliente.nomeCliente,
                                {
                                  shouldValidate: true,
                                },
                              );
                              form.setValue(
                                "telefone",
                                cliente.telefone || "",
                                {
                                  shouldValidate: true,
                                },
                              );
                              form.setValue("email", cliente.email || "", {
                                shouldValidate: true,
                              });

                              setIsExistingClient(true);
                              setOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            {cliente.nomeCliente}
                            <Check
                              className={cn(
                                "ml-auto",
                                field.value === cliente.nomeCliente
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}

                      {!isLoadingClients &&
                        filteredClientes.length === 0 &&
                        searchQuery.length > 0 && (
                          <CommandItem
                            key="novo-cliente"
                            value={searchQuery.toLowerCase()}
                            onSelect={() => {
                              form.setValue("nomeCliente", searchQuery, {
                                shouldValidate: false, // NÃO valida
                              });
                              form.setValue("telefone", "");
                              form.setValue("email", "");

                              setIsExistingClient(false);
                              setOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            {`Cadastrar novo cliente: "${searchQuery}"`}
                          </CommandItem>
                        )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="telefone"
          control={form.control}
          render={({ field: { onChange, onBlur, value, ref }, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="telefone">
                Telefone / WhatsApp (Opcional)
              </FieldLabel>
              <MaskedInput
                mask="(00) 00000-0000"
                id="telefone"
                placeholder="(85) 99999-9999"
                autoComplete="off"
                value={value || ""}
                onAccept={onChange}
                onBlur={onBlur}
                inputRef={ref}
                readOnly={isExistingClient}
                className={cn(isExistingClient ? "bg-muted" : "")}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email (Opcional)</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                placeholder="joao.silva@email.com"
                autoComplete="off"
                readOnly={isExistingClient}
                className={cn(isExistingClient ? "bg-muted" : "")}
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
      </FieldGroup>
    </div>
  );
}
