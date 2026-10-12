import { FileText, Image, Video, Music, FileArchive } from "lucide-react";
import type { SharedFile } from "@/types/file";

interface FileIconProps {
  type: SharedFile["type"];
}

export function FileIcon({ type }: FileIconProps) {
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
}
