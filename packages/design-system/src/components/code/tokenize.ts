import type { TokenKind } from "../../tokens/syntax";

export type Lang = "css" | "js" | "ts" | "tsx" | "html";

export type Token = { text: string; kind: TokenKind };
export type Line = Token[];

type Rule = {
  kind: TokenKind | ((match: string, rest: string, prev: Token | undefined) => TokenKind);
  re: RegExp;
};

const JS_KEYWORDS =
  /^(const|let|var|function|return|if|else|for|while|new|class|extends|import|export|default|from|as|await|async|typeof|instanceof|of|in|this|null|undefined|true|false)\b/;

const rules: Record<Lang, Rule[]> = {
  css: [
    { kind: "comment", re: /\/\*[\s\S]*?\*\// },
    { kind: "string", re: /"[^"]*"|'[^']*'/ },
    { kind: "keyword", re: /@[a-zA-Z-]+|!important/ },
    { kind: "property", re: /[-a-zA-Z]+(?=\s*:)/ },
    { kind: "number", re: /-?\d*\.?\d+(px|em|rem|%|s|ms|deg|vh|vw|fr|x)?\b/ },
    {
      // An identifier that opens a block is a selector; otherwise it's a value.
      kind: (_m, rest) => (/^[^;{}]*\{/.test(rest) ? "selector" : "plain"),
      re: /[.#:]{0,2}[-a-zA-Z_][-\w]*/,
    },
    { kind: "punctuation", re: /[{}:;,()>+~*]/ },
  ],
  js: [],
  ts: [],
  tsx: [],
  html: [
    { kind: "comment", re: /<!--[\s\S]*?-->/ },
    { kind: "string", re: /"[^"]*"|'[^']*'/ },
    { kind: "tag", re: /<\/?[a-zA-Z][\w-]*|\/?>/ },
    { kind: "property", re: /[a-zA-Z-]+(?==)/ },
    { kind: "punctuation", re: /[=]/ },
  ],
};

const jsRules: Rule[] = [
  { kind: "comment", re: /\/\/[^\n]*|\/\*[\s\S]*?\*\// },
  { kind: "string", re: /"[^"]*"|'[^']*'|`[^`]*`/ },
  { kind: "keyword", re: JS_KEYWORDS },
  { kind: "number", re: /-?\d*\.?\d+\b/ },
  { kind: "function", re: /[a-zA-Z_$][\w$]*(?=\s*\()/ },
  {
    // `foo` in `bar.foo` is a member, not a bare identifier.
    kind: (_m, _rest, prev) => (prev?.text.endsWith(".") ? "property" : "plain"),
    re: /[a-zA-Z_$][\w$]*/,
  },
  { kind: "punctuation", re: /[{}()[\];:,.=<>+\-*/&|!?]/ },
];

rules.js = jsRules;
rules.ts = jsRules;
rules.tsx = jsRules;

/**
 * A deliberately small tokenizer for the languages the channel puts on screen.
 *
 * Why not Shiki/Prism: the brand palette is only ~8 colors and every one of them carries a
 * channel-wide meaning (design doc §1). A general highlighter would introduce colors outside
 * the system — the thing the whole design system exists to prevent — and its async load would
 * fight `delayRender`. Highlighting on screen is a design decision, not a fidelity contest.
 */
export const tokenize = (code: string, lang: Lang): Line[] =>
  code.split("\n").map((line) => tokenizeLine(line, lang));

const tokenizeLine = (line: string, lang: Lang): Line => {
  const langRules = rules[lang];
  const tokens: Token[] = [];
  let pos = 0;

  const push = (text: string, kind: TokenKind) => {
    const last = tokens[tokens.length - 1];
    if (last && last.kind === kind) last.text += text;
    else tokens.push({ text, kind });
  };

  while (pos < line.length) {
    const rest = line.slice(pos);

    // Whitespace never carries meaning — merge it into the run so lines stay cheap to render.
    const ws = /^\s+/.exec(rest);
    if (ws) {
      push(ws[0], "plain");
      pos += ws[0].length;
      continue;
    }

    let matched = false;
    for (const rule of langRules) {
      const anchored = new RegExp(rule.re.source, rule.re.flags.replace(/[gy]/g, ""));
      const m = anchored.exec(rest);
      if (!m || m.index !== 0 || m[0].length === 0) continue;
      const kind =
        typeof rule.kind === "function"
          ? rule.kind(m[0], rest, tokens[tokens.length - 1])
          : rule.kind;
      push(m[0], kind);
      pos += m[0].length;
      matched = true;
      break;
    }

    if (!matched) {
      push(rest[0] as string, "plain");
      pos += 1;
    }
  }

  return tokens;
};

/** Character count of a tokenized line — used to drive the typing animation. */
export const lineLength = (line: Line): number =>
  line.reduce((sum, token) => sum + token.text.length, 0);
