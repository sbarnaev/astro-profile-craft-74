
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { ClientForm } from "@/components/clients/ClientForm";

interface AddClientDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAddClient: (data: any, analysisData?: any) => void;
}

export function AddClientDialog({ open, setOpen, handleAddClient }: AddClientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Добавить клиента
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить нового клиента</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового клиента в системе
          </DialogDescription>
        </DialogHeader>
        <ClientForm 
          onSubmit={handleAddClient} 
          generateAnalysis={true} 
          redirectAfterSubmit={false}
        />
      </DialogContent>
    </Dialog>
  );
}
