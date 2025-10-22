import { Check, Clock, History, Plus } from "lucide-react";
import { FormNovaOrdem } from "@/components/form-nova-ordem";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Home() {
  return (
    <>
      <Header />
      <div className="container mx-auto p-2 md:p-5">
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
              <h1 className="text-3xl font-bold">1</h1>
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
              <h1 className="text-3xl font-bold">1</h1>
            </CardContent>
          </Card>
        </div>
        <div className="mt-2 md:mt-5">
          <Card>
            <CardHeader>
              <CardTitle>Ordens Recentes</CardTitle>
              <CardDescription className="text-foreground/90">
                Últimas ordens de serviço cadastradas
              </CardDescription>
              <CardAction>
                <History />
              </CardAction>
            </CardHeader>
            <CardContent className="px-2">
              <div className="space-y-2">
                <div className="hover:bg-accent space-y-2 p-2 rounded-md border">
                  <div className="flex justify-between items-center">
                    <h2>João Silva</h2>
                    <Badge className="bg-blue-400" variant="secondary">
                      Em andamento
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <p>Conserto de tela</p>
                    <p>19/10/2025</p>
                  </div>
                </div>
                <div className="hover:bg-accent space-y-2 p-2 rounded-md border">
                  <div className="flex justify-between items-center">
                    <h2>Gabriel Sousa</h2>
                    <Badge className="bg-green-400" variant="secondary">
                      Concluído
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <p>Conserto de tela</p>
                    <p>19/10/2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button className="ml-auto mt-2 md:mt-5 flex items-center gap-2 bg-foreground">
                  Adicionar novo registro
                  <Plus />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Ordem de Serviço</DialogTitle>
                </DialogHeader>
                <FormNovaOrdem />
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </div>
    </>
  );
}
