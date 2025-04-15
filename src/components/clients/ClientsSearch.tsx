
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientsSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  filterOption: string;
  setFilterOption: (value: string) => void;
}

export function ClientsSearch({ 
  searchValue, 
  setSearchValue, 
  filterOption, 
  setFilterOption 
}: ClientsSearchProps) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Поиск по имени или телефону..." 
          className="pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Select value={filterOption} onValueChange={setFilterOption}>
        <SelectTrigger className="w-[180px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Фильтры" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все клиенты</SelectItem>
          <SelectItem value="recent">Недавние</SelectItem>
          <SelectItem value="frequent">Частые</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
