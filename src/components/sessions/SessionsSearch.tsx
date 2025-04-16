
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SessionsSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function SessionsSearch({ searchQuery, setSearchQuery }: SessionsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Поиск по клиенту, запросу или дате..."
        className="pl-10"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
