import { Wifi, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  fileCount: number;
}

export function Header({ fileCount }: HeaderProps) {
  return (
    <header className="border-b bg-white dark:bg-slate-900 sticky top-0 z-10 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Wifi className="size-5" />
          </div>
          <div>
            <h1 className="font-bold leading-none">Air Bridge</h1>
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <ShieldCheck className="size-3 text-emerald-500" /> Connected
              Securely
            </span>
          </div>
        </div>
        <Badge variant="outline" className="text-xs font-normal">
          {fileCount} files available
        </Badge>
      </div>
    </header>
  );
}
