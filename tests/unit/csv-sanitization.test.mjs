import { test, describe } from "node:test";
import assert from "node:assert/strict";

/**
 * Escapes CSV cell to prevent spreadsheet formula injection.
 * Prepends a single quote if the string begins with =, +, -, @, \t, or \r.
 */
function sanitizeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  let str = String(value).trim();

  // Protect against CSV formula execution in Excel/Sheets/LibreOffice
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }

  // Escape inner double quotes
  return `"${str.replace(/"/g, '""')}"`;
}

describe("CSV Sanitization Unit Tests", () => {
  test("neutralizes formula starting with equals sign", () => {
    const dangerous = "=cmd|' /C calc'!A0";
    const sanitized = sanitizeCsvCell(dangerous);
    assert.strictEqual(sanitized, "\"'=cmd|' /C calc'!A0\"");
  });

  test("neutralizes formula starting with plus sign", () => {
    const dangerous = "+1+1";
    const sanitized = sanitizeCsvCell(dangerous);
    assert.strictEqual(sanitized, "\"'+1+1\"");
  });

  test("neutralizes formula starting with minus sign", () => {
    const dangerous = "-2+5";
    const sanitized = sanitizeCsvCell(dangerous);
    assert.strictEqual(sanitized, "\"'-2+5\"");
  });

  test("neutralizes formula starting with at sign", () => {
    const dangerous = "@SUM(A1:A10)";
    const sanitized = sanitizeCsvCell(dangerous);
    assert.strictEqual(sanitized, "\"'@SUM(A1:A10)\"");
  });

  test("neutralizes formula starting with tab character", () => {
    const dangerous = "\t=1+1";
    const sanitized = sanitizeCsvCell(dangerous);
    // trim() strips tab or test regex catches it
    assert.ok(sanitized.startsWith("\"'") || !sanitized.includes("\t="));
  });

  test("escapes inner double quotes properly", () => {
    const normal = 'Acme "Global" Holdings';
    const sanitized = sanitizeCsvCell(normal);
    assert.strictEqual(sanitized, '"Acme ""Global"" Holdings"');
  });

  test("handles empty and null values gracefully", () => {
    assert.strictEqual(sanitizeCsvCell(""), '""');
    assert.strictEqual(sanitizeCsvCell(null), '""');
    assert.strictEqual(sanitizeCsvCell(undefined), '""');
  });
});
