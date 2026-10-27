import { JWT } from 'google-auth-library';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const TAB = 'Sheet1';

function client(): JWT {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set');
  const creds = JSON.parse(raw);
  return new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });
}

function base(): string {
  const id = process.env.SHEET_ID;
  if (!id) throw new Error('SHEET_ID is not set');
  return `https://sheets.googleapis.com/v4/spreadsheets/${id}`;
}

// All rows, header included. Row 1 of the result is sheet row 1.
export async function getRows(): Promise<string[][]> {
  const res = await client().request<{ values?: string[][] }>({
    url: `${base()}/values/${TAB}!A:J`,
  });
  return res.data.values ?? [];
}

// Adds one row at the bottom (columns A to J).
export async function appendRow(values: string[]): Promise<void> {
  await client().request({
    url: `${base()}/values/${TAB}!A:J:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    method: 'POST',
    data: { values: [values] },
  });
}

// Changes one cell, e.g. updateCell(5, 'J', '2026-11-05').
export async function updateCell(row: number, column: string, value: string): Promise<void> {
  await client().request({
    url: `${base()}/values/${TAB}!${column}${row}?valueInputOption=RAW`,
    method: 'PUT',
    data: { values: [[value]] },
  });
}