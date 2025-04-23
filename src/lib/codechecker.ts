/*
  For your information, this was vibe coded into existence 🥹
  I can't handle allat parsing and regex without AI
*/

export function checkForNestedMacros(code: string): {
  isNested: boolean;
  error?: string;
} {
  const macroPattern =
    /(LPH_NO_VIRTUALIZE|LPH_JIT|LPH_JIT_MAX|LPH_NO_UPVALUES)\s*\(/g;
  const foundMacros: { macro: string; start: number; end: number }[] = [];

  let match;
  while ((match = macroPattern.exec(code)) !== null) {
    const macroName = match[1];
    const startIndex = match.index;
    const closingIndex = findMatchingClosingParenthesis(
      code,
      match.index + match[0].length
    );

    if (closingIndex !== -1) {
      foundMacros.push({
        macro: macroName,
        start: startIndex,
        end: closingIndex,
      });
    }
  }

  foundMacros.sort((a, b) => a.start - b.start);

  for (const macro of foundMacros) {
    for (const other of foundMacros) {
      if (macro === other) continue;

      const isValidCombination =
        (other.macro === "LPH_JIT_MAX" &&
          macro.macro === "LPH_NO_VIRTUALIZE") ||
        (other.macro === "LPH_JIT" && macro.macro === "LPH_NO_VIRTUALIZE");

      if (other.macro === "LPH_NO_UPVALUES") {
        const contentBetweenParens = code
          .slice(other.start + "LPH_NO_UPVALUES(".length, other.end)
          .trim();
        if (contentBetweenParens.startsWith("function")) {
          continue;
        }
      }

      // Check if macro is inside other macro
      if (macro.start > other.start && macro.end < other.end) {
        // Special handling for LPH_NO_VIRTUALIZE - no macros allowed inside it
        if (other.macro === "LPH_NO_VIRTUALIZE") {
          const codeUpToMacro = code.slice(0, macro.start);
          const lineNumber = codeUpToMacro.split("\n").length;

          return {
            isNested: true,
            error: `Macro ${macro.macro} detected inside LPH_NO_VIRTUALIZE on line ${lineNumber}:\n\nMacros cannot be used inside LPH_NO_VIRTUALIZE.`,
          };
        }

        // For other macro combinations, continue with existing logic
        if (!isValidCombination) {
          // Extract the argument list of the outer macro
          const argStart = other.start + other.macro.length + 1; // skip macro name and '('
          const argEnd = other.end;
          const argContent = code.slice(argStart, argEnd);

          const macroIdx = argContent.indexOf(macro.macro);

          if (macro.macro === other.macro && macroIdx !== -1) {
            // Get all content from start of outer macro's argument to the nested macro
            const contentBeforeMacro = code.slice(argStart, macro.start);

            // Check if the nested macro is directly after the function declaration
            // or if it's part of a function call/connection inside the outer function

            // First, check if the outer macro has a function declaration
            if (contentBeforeMacro.trim().startsWith("function")) {
              // Now analyze what's between the function declaration and the nested macro
              const functionBodyBeforeMacro = contentBeforeMacro.slice(
                contentBeforeMacro.indexOf("function")
              );

              // Count balanced function/end pairs
              let functionDepth = 0;
              let isInFunctionCall = false;
              const lines = functionBodyBeforeMacro.split("\n");

              for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                // Track function depth
                const functionMatches = line.match(/function/g);
                if (functionMatches) functionDepth += functionMatches.length;

                const endMatches = line.match(/\bend\b/g);
                if (endMatches) functionDepth -= endMatches.length;

                // Check for patterns indicating we're in a function call or connection
                if (
                  /(:|\.)\s*\w+\s*\(/.test(line) ||
                  line.includes("Connect(") ||
                  line.includes("connect(") ||
                  /=\s*function\s*\(/.test(line)
                ) {
                  isInFunctionCall = true;
                }
              }

              // If we're inside a non-top-level function or a connection/callback, it's valid
              if (functionDepth > 1 || isInFunctionCall) {
                continue;
              }
            }

            // If we get here, it's an invalid nesting
            const codeUpToMacro = code.slice(0, macro.start);
            const lineNumber = codeUpToMacro.split("\n").length;

            return {
              isNested: true,
              error: `Directly nested ${macro.macro} detected on line ${lineNumber}:\n\n${macro.macro} cannot be nested inside itself.`,
            };
          }
        }
      }

      if (macro.macro === "LPH_NO_UPVALUES") {
        const contentBetweenParens = code
          .slice(macro.start + "LPH_NO_UPVALUES(".length, macro.end)
          .trim();

        if (
          /^(LPH_NO_VIRTUALIZE|LPH_JIT|LPH_JIT_MAX)\s*\(/.test(
            contentBetweenParens
          )
        ) {
          const lines = code.slice(0, macro.start).split("\n");
          const lineNumber = lines.length;

          return {
            isNested: true,
            error: `Invalid LPH_NO_UPVALUES usage on line ${lineNumber}:\n\nLPH_NO_UPVALUES cannot directly wrap other macros.`,
          };
        }
      }
    }
  }

  return { isNested: false };
}

function findMatchingClosingParenthesis(
  code: string,
  startIndex: number
): number {
  let depth = 1;

  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === "(") {
      depth++;
    } else if (code[i] === ")") {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }

  return -1;
}
