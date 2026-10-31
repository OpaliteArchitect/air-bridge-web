import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { SharedFile } from "@/types/file";
import { PinGateway } from "@/components/PinGateway";
import { FileList } from "@/components/FileList";

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

  const handleLogin = async (e: React.SubmitEvent) => {
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

  if (!isAuthenticated) {
    return (
      <PinGateway
        pin={pin}
        setPin={setPin}
        errorMessage={errorMessage}
        isLoadingAuth={isLoadingAuth}
        onLogin={handleLogin}
      />
    );
  }

  return <FileList files={files} onDownload={handleDownload} />;
}
