import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Filter, Loader2, Search, X } from "lucide-react";
import { useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  onClear,
  loading = false,
  placeholder = "Search notes with AI...",
  className,
  showFilters = false,
  onToggleFilters,
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(value);
    }
    if (e.key === "Escape") {
      onClear();
    }
  };

  const handleClear = () => {
    onChange("");
    onClear();
  };

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "pl-10 pr-10 transition-all duration-200",
            isFocused && "ring-2 ring-primary/20"
          )}
          disabled={loading}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-muted"
            onClick={handleClear}
            disabled={loading}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {showFilters && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleFilters}
          className="shrink-0"
        >
          <Filter className="h-4 w-4" />
        </Button>
      )}

      <Button
        onClick={() => onSearch(value)}
        disabled={!value.trim() || loading}
        className="min-w-[100px] shrink-0"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Searching
          </>
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );
};
