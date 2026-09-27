import { useState } from "react";

import {
  Search,
  ChevronDown,
  ChevronRight,
  FileCode2,
} from "lucide-react";

import "./SearchPanel.css";

function SearchPanel({
  files,
  fileContents,
  onSelectFile,
  onOpenFile,
  onClose,
}) {
  // Support multiple prop names for backwards compatibility
  const source = files || fileContents || {};
  const handleSelect = onSelectFile || onOpenFile || (() => {});
  const [query, setQuery] = useState("");
  const [replaceText, setReplaceText] =
    useState("");
  const [replaceOpen, setReplaceOpen] =
    useState(false);

  const results = Object.entries(source)
    .flatMap(([fileName, content]) => {
      if (!query.trim()) return [];

      const searchTerm = query.toLowerCase();

      return content
        .split("\n")
        .map((line, index) => ({
          fileName,
          line,
          lineNumber: index + 1,
        }))
        .filter((item) =>
          item.line
            .toLowerCase()
            .includes(searchTerm)
        );
    });

  const groupedResults = results.reduce(
    (groups, result) => {
      if (!groups[result.fileName]) {
        groups[result.fileName] = [];
      }

      groups[result.fileName].push(result);

      return groups;
    },
    {}
  );

  const totalMatches = results.length;

  return (
    <aside className="vscode-search-panel">
      <div className="search-panel-header">
        <div>
          <span>SEARCH</span>

          <button
            onClick={onClose}
            title="Close Search"
          >
            ×
          </button>
        </div>
      </div>

      <div className="search-input-area">
        <div className="search-field">
          <Search size={15} />

          <input
            autoFocus
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search"
            spellCheck="false"
          />
        </div>

        <button
          className="replace-toggle"
          onClick={() =>
            setReplaceOpen(
              (current) => !current
            )
          }
        >
          {replaceOpen ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}

          Replace
        </button>

        {replaceOpen && (
          <div className="search-field replace-field">
            <span className="replace-icon">
              ↳
            </span>

            <input
              value={replaceText}
              onChange={(event) =>
                setReplaceText(
                  event.target.value
                )
              }
              placeholder="Replace"
              spellCheck="false"
            />
          </div>
        )}
      </div>

      <div className="search-summary">
        {query.trim()
          ? `${totalMatches} ${
              totalMatches === 1
                ? "result"
                : "results"
            }`
          : "Search across the project"}
      </div>

      <div className="search-results">
        {Object.entries(
          groupedResults
        ).map(([fileName, fileResults]) => (
          <div
            className="search-file-group"
            key={fileName}
          >
            <button
              className="search-file-header"
              onClick={() => handleSelect(fileName)}
            >
              <ChevronDown size={14} />

              <FileCode2 size={14} />

              <span>{fileName}</span>

              <small>
                {fileResults.length}
              </small>
            </button>

            {fileResults.map((result, index) => (
              <button
                className="search-result"
                key={`${fileName}-${index}`}
                onClick={() => handleSelect(fileName)}
              >
                <span className="result-line">
                  {result.lineNumber}
                </span>

                <span className="result-text">
                  {result.line.trim() ||
                    "\u00A0"}
                </span>
              </button>
            ))}
          </div>
        ))}

        {query.trim() &&
          totalMatches === 0 && (
            <div className="search-empty">
              No results found.
            </div>
          )}
      </div>
    </aside>
  );
}

export default SearchPanel;