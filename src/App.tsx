import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Download,
  FileText,
  Image,
  Video,
  Music,
  FileArchive,
  Lock,
  Wifi,
  Loader2,
} from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  size: string;
  type?: "document" | "image" | "video" | "audio" | "archive";
}

// Helper to infer file type from extension for icon rendering
const getFileType = (name: string): NonNullable<SharedFile["type"]> => {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["pdf", "docx", "doc", "txt", "xlsx", "xls"].includes(ext))
    return "document";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "aac", "flac"].includes(ext)) return "audio";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  return "document";
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(true);
  const [pin, setPin] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [files, setFiles] = useState<SharedFile[]>([]);

  // Check active session / fetch files on mount
  useEffect(() => {
    async function fetchFiles() {
      try {
        const res = await fetch("/api/files", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFiles(data);
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to fetch files:", err);
      } finally {
        setIsLoadingFiles(false);
      }
    }

    fetchFiles();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setIsLoadingAuth(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        // Fetch files immediately after successful auth
        const filesRes = await fetch("/api/files", {
          credentials: "include",
        });
        if (filesRes.ok) {
          const filesData = await filesRes.json();
          setFiles(filesData);
        }
      } else {
        setErrorMessage("Invalid PIN. Please try again.");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setErrorMessage("Connection error. Please check your network.");
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const getFileIcon = (type: SharedFile["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="size-5 text-blue-500" />;
      case "image":
        return <Image className="size-5 text-emerald-500" />;
      case "video":
        return <Video className="size-5 text-purple-500" />;
      case "audio":
        return <Music className="size-5 text-amber-500" />;
      case "archive":
        return <FileArchive className="size-5 text-rose-500" />;
      default:
        return <FileText className="size-5 text-gray-500" />;
    }
  };

  const handleDownload = (id: string) => {
    const a = document.createElement("a");
    a.href = `/api/download/${id}`;
    a.click();
  };

  if (isLoadingFiles) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  // --- PIN GATEWAY SCREEN ---
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Wifi className="size-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Air Bridge</h1>
            <p className="text-sm text-muted-foreground">
              Secure Offline File Sharing Hub
            </p>
          </div>

          <Card className="shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="size-5 text-muted-foreground" /> Enter Access
                PIN
              </CardTitle>
              <CardDescription>
                Enter the PIN provided by the host device to view files.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="••••"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="text-center text-lg tracking-widest"
                    autoFocus
                  />
                  {errorMessage && (
                    <p className="text-xs text-destructive text-center">
                      {errorMessage}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoadingAuth}
                >
                  {isLoadingAuth ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  Access Files
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // --- FLAT FILE LIST SCREEN ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-12">
      {/* Header bar */}
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
            {files.length} files available
          </Badge>
        </div>
      </header>

      {/* Main File Container */}
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
                    onClick={() => handleDownload(file.id)}
                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getFileIcon(fileType)}
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
