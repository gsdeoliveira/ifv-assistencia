import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { FormData } from "@/lib/schemas";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { MaskedInput } from "./ui/input-phone-number";

interface FormEtapaClienteProps {
  form: UseFormReturn<FormData>;
}
export function FormEtapaCliente({ form }: FormEtapaClienteProps) {
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Controller
          name="nomeCliente"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="nomeCliente">Nome do Cliente</FieldLabel>
              <Input
                {...field}
                id="nomeCliente"
                aria-invalid={fieldState.invalid}
                placeholder="João da Silva"
                autoComplete="off"
              />
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
              <FieldLabel htmlFor="telefone">Telefone / WhatsApp</FieldLabel>
              {/* 3. Usamos o nosso MaskedInput, que mantém 100% o estilo */}
              <MaskedInput
                mask="(00) 00000-0000"
                id="telefone"
                placeholder="(85) 99999-9999"
                autoComplete="off"
                value={value || ""}
                onAccept={onChange}
                onBlur={onBlur}
                inputRef={ref} // Passamos a ref para o nosso componente
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
