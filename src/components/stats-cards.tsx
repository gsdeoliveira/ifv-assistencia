import { Check, Clock } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardsProps {
  emAndamentoCount: number;
  concluidosCount: number;
}

export function StatCards({
  emAndamentoCount,
  concluidosCount,
}: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5">
      <Card className="bg-blue-400">
        <CardHeader>
          <CardTitle>Em Andamento</CardTitle>
          <CardDescription className="text-foreground/90">
            Aparelhos sendo reparados
          </CardDescription>
          <CardAction>
            <Clock />
          </CardAction>
        </CardHeader>
        <CardContent>
          <h1 className="text-3xl font-bold">{emAndamentoCount}</h1>
        </CardContent>
      </Card>
      <Card className="bg-green-400">
        <CardHeader>
          <CardTitle>Concluídos</CardTitle>
          <CardDescription className="text-foreground/90">
            Aparelhos concluídos
          </CardDescription>
          <CardAction>
            <Check />
          </CardAction>
        </CardHeader>
        <CardContent>
          <h1 className="text-3xl font-bold">{concluidosCount}</h1>
        </CardContent>
      </Card>
    </div>
  );
}
