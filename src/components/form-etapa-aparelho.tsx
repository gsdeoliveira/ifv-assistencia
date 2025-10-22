import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormData } from "@/lib/schemas";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";

interface FormEtapaAparelhoProps {
  form: UseFormReturn<FormData>;
}

export function FormEtapaAparelho({ form }: FormEtapaAparelhoProps) {
  return (
    <div className="space-y-4">
      <FieldGroup>
        <Controller
          name="tipoAparelho"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Tipo de Aparelho</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id={field.name}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Celular">Celular</SelectItem>
                  <SelectItem value="Tablet">Tablet</SelectItem>
                  <SelectItem value="Notebook">Notebook</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="marca"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="marca">Marca</FieldLabel>
              <Input
                {...field}
                id="marca"
                placeholder="Samsung"
                autoComplete="off"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="modelo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="modelo">Modelo</FieldLabel>
              <Input
                {...field}
                id="modelo"
                placeholder="Galaxy S23 Ultra"
                autoComplete="off"
              />
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </Field>
          )}
        />
        <Controller
          name="defeitoRelatado"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="defeitoRelatado">
                Defeito Relatado
              </FieldLabel>
              <Textarea
                {...field}
                id="defeitoRelatado"
                placeholder="Cliente informou que o aparelho caiu na água e não liga mais..."
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
