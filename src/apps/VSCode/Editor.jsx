import { useEffect, useRef, useState } from "react";

import "./Editor.css";

export const Editor = ({
  value,
  filePath,
  fileName,
  onChange,
  onSave,
}) => {
  const textareaRef = useRef(null);
  const gutterRef = useRef(null);

  const [activeLine, setActiveLine] = useState(1);

  const name = fileName || filePath || "";
  const lines = (value || "").split("\n");

  const updateActiveLine = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const beforeCursor = value.slice(0, textarea.selectionStart);
    setActiveLine(beforeCursor.split("\n").length);
  };

  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      onSave();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const nextValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(nextValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = start + 2;
        textarea.selectionEnd = start + 2;
      });
      return;
    }
    if (event.key === "Enter") {
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const currentLine = value.slice(0, start).split("\n").pop();
      const indentation = currentLine.match(/^\s*/)?.[0] || "";
      if (indentation.length > 0) {
        event.preventDefault();
        const inserted = `\n${indentation}`;
        const nextValue = value.substring(0, start) + inserted + value.substring(textarea.selectionEnd);
        onChange(nextValue);
        requestAnimationFrame(() => {
          const cursorPosition = start + inserted.length;
          textarea.selectionStart = cursorPosition;
          textarea.selectionEnd = cursorPosition;
        });
      }
    }
  };

  const handleScroll = () => {
    const textarea = textareaRef.current;
    const gutter = gutterRef.current;
    if (!textarea) return;
    if (gutter) {
      gutter.scrollTop = textarea.scrollTop;
    }
  };

  useEffect(() => {
    textareaRef.current?.focus();
  }, [name]);

  return (
    <div className="editor-scroll">
      <div className="editor-gutter" ref={gutterRef}>
        {lines.map((_, index) => (
          <div
            key={index}
            className={index + 1 === activeLine ? "editor-gutter-line active" : "editor-gutter-line"}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          updateActiveLine();
        }}
        onKeyDown={handleKeyDown}
        onClick={updateActiveLine}
        onKeyUp={updateActiveLine}
        onSelect={updateActiveLine}
        onScroll={() => {
          // Keep the gutter in sync with the textarea scroll
          if (gutterRef.current) {
            gutterRef.current.scrollTop = textareaRef.current.scrollTop;
          }
        }}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        aria-label={`${name} editor`}
      />
    </div>
  );
};