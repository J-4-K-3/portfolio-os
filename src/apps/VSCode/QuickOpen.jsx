import { useEffect, useRef, useState } from "react";

import {
  FileCode2,
  Search,
} from "lucide-react";

import "./QuickOpen.css";

function QuickOpen({
  files,
  onSelectFile,
  onClose,
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const fileNames = Object.keys(files);

  const filteredFiles = fileNames.filter(
    (fileName) =>
      fileName
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const firstFile =
        filteredFiles[0];

      if (firstFile) {
        onSelectFile(firstFile);
      }
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
    }
  };

  return (
    <div
      className="quick-open-backdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="quick-open">
        <div className="quick-open-input">
          <Search size={16} />

          <input
            ref={inputRef}
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Search files by name..."
            spellCheck="false"
          />
        </div>

        <div className="quick-open-results">
          {filteredFiles.map(
            (fileName, index) => (
              <button
                key={fileName}
                className={
                  index === 0
                    ? "quick-file active"
                    : "quick-file"
                }
                onClick={() =>
                  onSelectFile(fileName)
                }
              >
                <FileCode2 size={16} />

                <span>{fileName}</span>

                <small>
                  src
                </small>
              </button>
            )
          )}

          {filteredFiles.length === 0 && (
            <div className="quick-empty">
              No matching files.
            </div>
          )}
        </div>

        <div className="quick-open-footer">
          <span>↵ Open</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}

export default QuickOpen;