
import { Edit, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ClientProfileHeaderProps {
  clientId: string;
  setOpen: (open: boolean) => void;
}

export const ClientProfileHeader = ({ clientId, setOpen }: ClientProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to="/clients">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Профиль клиента</h1>
      </div>
      
      <div className="flex gap-2">
        <Dialog onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
    </div>
  );
};
