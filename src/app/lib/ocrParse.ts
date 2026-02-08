/**
 * Parse OCR text to extract print time (minutes) and price (number).
 * Handles common formats from printer displays, slicers, receipts, etc.
 */

export interface ParsedFromImage {
  printTimeMinutes: number | null;
  price: number | null;
  rawText: string;
}

/** Match print time: "2h 35m", "2h 35 min", "155 min", "2:35", "2h", "35m" */
function parsePrintTime(text: string): number | null {
  const lines = text.split(/\s*\n\s*/);
  const joined = text.replace(/\s+/g, " ");

  // Pattern: Xh Ym or Xh Y min
  const hMinMatch = joined.match(/(\d+)\s*h(?:our)?s?\s*(\d+)\s*m(?:in)?/i) ||
    joined.match(/(\d+)\s*:\s*(\d+)\s*(?:h|m|min)/i) ||
    joined.match(/(\d+)\s*h\s*(\d+)\s*m/i);
  if (hMinMatch) {
    const h = parseInt(hMinMatch[1], 10);
    const m = parseInt(hMinMatch[2], 10);
    if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
  }

  // Pattern: Xh (hours only)
  const hOnly = joined.match(/(\d+)\s*h(?:our)?s?(?:\s|$|m)/i);
  if (hOnly) {
    const h = parseInt(hOnly[1], 10);
    if (!isNaN(h)) return h * 60;
  }

  // Pattern: Xm or X min (minutes only)
  const mOnly = joined.match(/(\d+)\s*m(?:in)?(?:\s|$)/i) || joined.match(/(\d+)\s*minutes?/i);
  if (mOnly) {
    const m = parseInt(mOnly[1], 10);
    if (!isNaN(m)) return m;
  }

  // Pattern: X:YY (e.g. 2:35)
  const colonMatch = joined.match(/(\d+)\s*:\s*(\d+)(?:\s|$|m|h)/);
  if (colonMatch) {
    const h = parseInt(colonMatch[1], 10);
    const m = parseInt(colonMatch[2], 10);
    if (!isNaN(h) && !isNaN(m)) return h * 60 + m;
  }

  return null;
}

/** Match price: $24.99, $6.99, 24.99, €10.50 */
function parsePrice(text: string): number | null {
  const joined = text.replace(/\s+/g, " ");
  // Match $X.XX or X.XX (with at least one decimal)
  const match = joined.match(/[$€£]?\s*(\d+[.,]\d{2})(?:\s|$|[^\d])/);
  if (match) {
    const num = parseFloat(match[1].replace(",", "."));
    return isNaN(num) ? null : num;
  }
  return null;
}

export function parseOcrText(text: string): ParsedFromImage {
  return {
    printTimeMinutes: parsePrintTime(text),
    price: parsePrice(text),
    rawText: text,
  };
}
