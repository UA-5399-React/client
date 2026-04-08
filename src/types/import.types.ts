export interface ImportFailedRow {
  row: number;
  reason: string;
}

export interface ImportResult {
  imported: number;
  failed: ImportFailedRow[];
}
