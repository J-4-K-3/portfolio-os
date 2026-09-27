import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";

import { getFileExtension } from "../../data/projectFiles";

function getFileIcon(path) {
  const extension = getFileExtension(path);

  if (extension === "jsx" || extension === "js" || extension === "py") {
    return FileCode2;
  }

  if (extension === "json") {
    return FileJson;
  }

  return FileText;
}

function getName(path) {
  return path.split("/").pop();
}

function ProjectTree({
  tree,
  expandedFolders,
  selectedPath,
  onToggleFolder,
  onOpenFile,
}) {
  return (
    <div className="project-tree">
      {tree.map((item) => {
        const name = getName(item.path);
        const isFolder = item.type === "folder";
        const isExpanded = expandedFolders.has(item.path);
        const isSelected = selectedPath === item.path;

        const Icon = isFolder
          ? isExpanded
            ? FolderOpen
            : Folder
          : getFileIcon(item.path);

        return (
          <div key={item.path}>
            <button
              className={`tree-item ${
                isSelected ? "tree-item-selected" : ""
              }`}
              style={{
                paddingLeft: `${10 + item.depth * 14}px`,
              }}
              onClick={() => {
                if (isFolder) {
                  onToggleFolder(item.path);
                } else {
                  onOpenFile(item.path);
                }
              }}
            >
              {isFolder ? (
                isExpanded ? (
                  <ChevronDown size={13} />
                ) : (
                  <ChevronRight size={13} />
                )
              ) : (
                <span className="tree-spacer" />
              )}

              <Icon size={15} />

              <span className="tree-item-name">
                {name}
              </span>
            </button>

            {isFolder && isExpanded && item.children?.length > 0 && (
              <ProjectTree
                tree={item.children}
                expandedFolders={expandedFolders}
                selectedPath={selectedPath}
                onToggleFolder={onToggleFolder}
                onOpenFile={onOpenFile}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProjectTree;