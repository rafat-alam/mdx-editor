import { Input } from '@/components/ui2/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search in your repositories, files and folders..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8 text-sm"
      />
    </div>
  );
}
