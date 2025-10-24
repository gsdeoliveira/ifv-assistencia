import { z } from "zod";

export const formSchema = z.object({
  nomeCliente: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  telefone: z.string(),
  email: z
    .email({ message: "Digite um e-mail válido." })
    .optional()
    .or(z.literal("")),

  tipoAparelho: z.enum(["Celular", "Tablet", "Notebook"] as const, {
    message: "Selecione o tipo do aparelho.",
  }),
  marca: z.string().min(2, { message: "A marca é obrigatória." }),
  modelo: z.string().min(2, { message: "O modelo é obrigatório." }),
  defeitoRelatado: z.string().min(5, {
    message: "Descreva o defeito com mais detalhes (mín. 5 caracteres).",
  }),
});

export type FormData = z.infer<typeof formSchema>;
