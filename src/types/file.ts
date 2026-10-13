export interface SharedFile {
  id: string;
  name: string;
  size: string;
  type?: "document" | "image" | "video" | "audio" | "archive";
}

// Helper to infer file type from extension for icon rendering
export const getFileType = (name: string): NonNullable<SharedFile["type"]> => {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["pdf", "docx", "doc", "txt", "xlsx", "xls"].includes(ext))
    return "document";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "image";
  if (["mp4", "mov", "avi", "mkv"].includes(ext)) return "video";
  if (["mp3", "wav", "aac", "flac"].includes(ext)) return "audio";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
  return "document";
};
