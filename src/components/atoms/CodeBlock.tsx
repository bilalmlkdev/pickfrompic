import React from "react";

interface Props {
  code: string;
  language: "css" | "json" | "svg";
}

const highlightCss = (code: string): React.ReactNode[] => {
  const tokens: React.ReactNode[] = [];
  const regex = /(\/\*[\s\S]*?\*\/)|(--[\w-]+)|(:\s*[^;{]+)|([{};,])|(#[0-9a-fA-F]{3,8})|(rgb|hsl|hsl|linear-gradient|radial-gradient)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(<span key={lastIndex}>{code.slice(lastIndex, match.index)}</span>);
    }
    if (match[1]) {
      tokens.push(<span key={match.index} className="text-emerald-600">{match[0]}</span>);
    } else if (match[2]) {
      tokens.push(<span key={match.index} className="text-sky-400">{match[0]}</span>);
    } else if (match[3]) {
      tokens.push(<span key={match.index} className="text-amber-300">{match[0]}</span>);
    } else if (match[4]) {
      tokens.push(<span key={match.index} className="text-muted-foreground">{match[0]}</span>);
    } else if (match[5]) {
      tokens.push(<span key={match.index} className="text-rose-400">{match[0]}</span>);
    } else if (match[6]) {
      tokens.push(<span key={match.index} className="text-purple-400">{match[0]}</span>);
    } else {
      tokens.push(<span key={match.index}>{match[0]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push(<span key={lastIndex}>{code.slice(lastIndex)}</span>);
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
        lineTokens.push(<span key={`${lineIndex}-${lineLastIndex}`}>{line.slice(lineLastIndex, allMatch.index)}</span>);
      }

      if (allMatch[1]) {
        const isKey = keyPositions.includes(allMatch.index);
        lineTokens.push(
          <span key={`${lineIndex}-${allMatch.index}`} className={isKey ? "text-sky-400" : "text-amber-300"}>
            {allMatch[0]}
          </span>
        );
      } else if (allMatch[2]) {
        lineTokens.push(<span key={`${lineIndex}-${allMatch.index}`} className="text-rose-400">{allMatch[0]}</span>);
      } else if (allMatch[3]) {
        lineTokens.push(<span key={`${lineIndex}-${allMatch.index}`} className="text-muted-foreground">{allMatch[0]}</span>);
      } else if (allMatch[4] || allMatch[5]) {
        lineTokens.push(<span key={`${lineIndex}-${allMatch.index}`} className="text-muted-foreground">{allMatch[0]}</span>);
      }

      lineLastIndex = allMatch.index + allMatch[0].length;
    }

    if (lineLastIndex < line.length) {
      lineTokens.push(<span key={`${lineIndex}-end`}>{line.slice(lineLastIndex)}</span>);
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
      tokens.push(<span key={lastIndex}>{code.slice(lastIndex, match.index)}</span>);
    }
    if (match[1]) {
      tokens.push(<span key={match.index} className="text-rose-400">{match[0]}</span>);
    } else if (match[2]) {
      tokens.push(<span key={match.index} className="text-sky-400">{match[0]}</span>);
    } else if (match[3]) {
      tokens.push(<span key={match.index} className="text-amber-300">{match[0]}</span>);
    } else {
      tokens.push(<span key={match.index} className="text-muted-foreground">{match[0]}</span>);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < code.length) {
    tokens.push(<span key={lastIndex}>{code.slice(lastIndex)}</span>);
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
    <pre className="text-xs font-mono overflow-auto whitespace-pre-wrap leading-relaxed">
      {highlighted}
    </pre>
  );
};

export default CodeBlock;
