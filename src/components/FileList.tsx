import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { FileIcon } from "@/components/FileIcon";
import type { SharedFile } from "@/types/file";
import { getFileType } from "@/types/file";

interface FileListProps {
  files: SharedFile[];
  onDownload: (id: string) => void;
}

export function FileList({ files, onDownload }: FileListProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12">
      <Header fileCount={files.length} />

      <main className="max-w-3xl mx-auto px-4 mt-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Available Files
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {files.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No files available on this host.
              </div>
            ) : (
              files.map((file) => {
                const fileType = getFileType(file.name);
                return (
                  <div
                    key={file.id}
                    onClick={() => onDownload(file.id)}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        <FileIcon type={fileType} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {file.size}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 ml-2 text-muted-foreground group-hover:text-primary"
                    >
                      <Download className="size-4" />
                    </Button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
