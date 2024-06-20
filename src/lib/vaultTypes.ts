import { z } from "zod";

export const vaultType = z.enum(["text", "kv", "spreadsheet"]);

export type VaultType = z.infer<typeof vaultType>;

export const vaultTypeLabels = {
  text: "Text",
  kv: "Key-value pairs",
  spreadsheet: "Spreadsheet",
};

export const vaultTypeIcons = {
  text: "📝",
  kv: "🔑",
  spreadsheet: "📊",
};
