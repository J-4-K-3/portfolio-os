import {
  FileCode2,
  FileJson,
  FileText,
  Folder,
  Image,
} from "lucide-react";

export function getFileName(path) {
  return path.split("/").pop();
}

export function getParentPath(path) {
  const parts = path.split("/");

  if (parts.length <= 1) {
    return "";
  }

  return parts
    .slice(0, -1)
    .join("/");
}

export function getExtension(path) {
  const fileName = getFileName(path);

  if (!fileName.includes(".")) {
    return "";
  }

  return fileName
    .split(".")
    .pop()
    .toLowerCase();
}

export function getFileIcon(
  path,
  isFolder = false
) {
  if (isFolder) {
    return Folder;
  }

  const extension =
    getExtension(path);

  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return FileCode2;

    case "json":
      return FileJson;

    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "gif":
    case "svg":
      return Image;

    default:
      return FileText;
  }
}

export function getApplicationForFile(
  path
) {
  const extension =
    getExtension(path);

  switch (extension) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "css":
    case "html":
    case "json":
    case "md":
      return "vscode";

    case "txt":
      return "notepad";

    case "png":
    case "jpg":
    case "jpeg":
    case "webp":
    case "gif":
      return "photos";

    default:
      return null;
  }
}

export function isImageFile(path) {
  return [
    "png",
    "jpg",
    "jpeg",
    "webp",
    "gif",
    "svg",
  ].includes(getExtension(path));
}