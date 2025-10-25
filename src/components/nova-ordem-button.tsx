import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormNovaOrdem } from "./form-nova-ordem";

interface NovaOrdemButtonProps {
  onOrderCreated: (orderId: string) => void;
}

export function NovaOrdemButton({ onOrderCreated }: NovaOrdemButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmitSuccess = (orderId: string) => {
    setIsModalOpen(false);
    onOrderCreated(orderId);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
        <FormNovaOrdem onOrderCreated={handleFormSubmitSuccess} />
      </DialogContent>
    </Dialog>
  );
}
