import React from "react";

interface Props {
  code: string;
  language: "css" | "json" | "svg";
}

const C = {
  comment: "#5c6370",
  property: "#c678dd",
  value: "#98c379",
  string: "#98c379",
  number: "#d19a66",
  hex: "#56b6c2",
  func: "#61afef",
  punct: "#abb2bf",
  tag: "#e06c75",
  attr: "#d19a66",
  text: "#abb2bf",
};

const highlightCss = (code: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  const regex = /(\/\*[\s\S]*?\*\/)|(--[\w-]+)|(:\s*[^;{]+)|([{};,])|(#[0-9a-fA-F]{3,8})|(rgb|hsl|linear-gradient|radial-gradient)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(<span key={lastIndex} style={{ color: C.text }}>{code.slice(lastIndex, match.index)}</span>);
    }
    if (match[1]) {
      tokens.push(<span key={match.index} style={{ color: C.comment, fontStyle: "italic" }}>{match[0]}</span>);
    } else if (match[2]) {
      tokens.push(<span key={match.index} style={{ color: C.property }}>{match[0]}</span>);
    } else if (match[3]) {
      tokens.push(<span key={match.index} style={{ color: C.value }}>{match[0]}</span>);
    } else if (match[4]) {
      tokens.push(<span key={match.index} style={{ color: C.punct }}>{match[0]}</span>);
    } else if (match[5]) {
      tokens.push(<span key={match.index} style={{ color: C.hex }}>{match[0]}</span>);
    } else if (match[6]) {
      tokens.push(<span key={match.index} style={{ color: C.func }}>{match[0]}</span>);
    } else {
      tokens.push(<span key={match.index} style={{ color: C.text }}>{match[0]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push(<span key={lastIndex} style={{ color: C.text }}>{code.slice(lastIndex)}</span>);
  }

  return tokens;
};

const highlightJson = (code: string): React.ReactNode[] => {
  const lines = code.split("\n");
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    const lineTokens: React.ReactNode[] = [];
    let lineLastIndex = 0;

    const lineRegex = /("(?:[^"\\]|\\.)*")\s*:/g;
    let lineMatch;
    const keyPositions: number[] = [];

    while ((lineMatch = lineRegex.exec(line)) !== null) {
      keyPositions.push(lineMatch.index);
    }

    const allRegex = /("(?:[^"\\]|\\.)*")|(\b\d+\b)|([{}[\]])|(:)|(,)/g;
    let allMatch;

    while ((allMatch = allRegex.exec(line)) !== null) {
      if (allMatch.index > lineLastIndex) {
        lineTokens.push(<span key={`${lineIndex}-${lineLastIndex}`} style={{ color: C.text }}>{line.slice(lineLastIndex, allMatch.index)}</span>);
      }

      if (allMatch[1]) {
        const isKey = keyPositions.includes(allMatch.index);
        lineTokens.push(
          <span key={`${lineIndex}-${allMatch.index}`} style={{ color: isKey ? C.property : C.string }}>
            {allMatch[0]}
          </span>
        );
      } else if (allMatch[2]) {
        lineTokens.push(<span key={`${lineIndex}-${allMatch.index}`} style={{ color: C.number }}>{allMatch[0]}</span>);
      } else if (allMatch[3]) {
        lineTokens.push(<span key={`${lineIndex}-${allMatch.index}`} style={{ color: C.punct }}>{allMatch[0]}</span>);
      } else if (allMatch[4] || allMatch[5]) {
        lineTokens.push(<span key={`${lineIndex}-${allMatch.index}`} style={{ color: C.punct }}>{allMatch[0]}</span>);
      }

      lineLastIndex = allMatch.index + allMatch[0].length;
    }

    if (lineLastIndex < line.length) {
      lineTokens.push(<span key={`${lineIndex}-end`} style={{ color: C.text }}>{line.slice(lineLastIndex)}</span>);
    }

    result.push(<span key={`line-${lineIndex}`}>{lineTokens}</span>);
    if (lineIndex < lines.length - 1) {
      result.push(<span key={`newline-${lineIndex}`}>{"\n"}</span>);
    }
  });

  return result;
};

const highlightSvg = (code: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  const regex = /(<\/?[\w-]+)|(\s[\w-]+=)|(".*?")|(\/>|>)|(&lt;|&gt;)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(<span key={lastIndex} style={{ color: C.text }}>{code.slice(lastIndex, match.index)}</span>);
    }
    if (match[1]) {
      tokens.push(<span key={match.index} style={{ color: C.tag }}>{match[0]}</span>);
    } else if (match[2]) {
      tokens.push(<span key={match.index} style={{ color: C.attr }}>{match[0]}</span>);
    } else if (match[3]) {
      tokens.push(<span key={match.index} style={{ color: C.string }}>{match[0]}</span>);
    } else {
      tokens.push(<span key={match.index} style={{ color: C.punct }}>{match[0]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push(<span key={lastIndex} style={{ color: C.text }}>{code.slice(lastIndex)}</span>);
  }

  return tokens;
};

const CodeBlock: React.FC<Props> = ({ code, language }) => {
  const highlighted = (() => {
    switch (language) {
      case "css": return highlightCss(code);
      case "json": return highlightJson(code);
      case "svg": return highlightSvg(code);
      default: return [code];
    }
  })();

  return (
    <pre
      className="rounded-xl p-3 text-xs font-mono overflow-auto whitespace-pre-wrap leading-relaxed h-full"
      style={{ backgroundColor: "#282c34", color: C.text }}
    >
      {highlighted}
    </pre>
  );
};

export default CodeBlock;
