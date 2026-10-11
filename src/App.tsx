import { useState } from "react";
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
} from "lucide-react";

interface SharedFile {
  id: string;
  name: string;
  size: string;
  type: "document" | "image" | "video" | "audio" | "archive";
}

const MOCK_FILES: SharedFile[] = [
  {
    id: "1",
    name: "Mathematics_Grade_10_Notes.pdf",
    size: "14.2 MB",
    type: "document",
  },
  { id: "2", name: "Physics_Lecture_Ch4.mp4", size: "128.5 MB", type: "video" },
  {
    id: "3",
    name: "Science_Fair_Guidelines.docx",
    size: "512 KB",
    type: "document",
  },
  { id: "4", name: "Map_Of_Local_Region.png", size: "3.1 MB", type: "image" },
  {
    id: "5",
    name: "English_Listening_Practice.mp3",
    size: "15.8 MB",
    type: "audio",
  },
  {
    id: "6",
    name: "Past_Exam_Papers_Bundle.zip",
    size: "45.0 MB",
    type: "archive",
  },
];

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock check: any 4-digit PIN or "1234" unlocks it for demo purposes
    if (pin.length >= 4) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
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

  const handleDownload = (fileName: string) => {
    // In production, this points to the Ktor HTTP server download endpoint e.g., window.location.href = `/api/download/${id}`
    alert(`Initiating download for: ${fileName}`);
  };

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
                  {error && (
                    <p className="text-xs text-destructive text-center">
                      Please enter a valid PIN to continue.
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
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
            {MOCK_FILES.length} files available
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
            {MOCK_FILES.map((file) => (
              <div
                key={file.id}
                onClick={() => handleDownload(file.name)}
                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    {getFileIcon(file.type)}
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
