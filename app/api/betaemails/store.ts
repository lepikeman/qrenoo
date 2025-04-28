// Simple file-based storage for beta emails (for demo/dev only)
import { promises as fs } from 'fs';
import path from 'path';

const EMAILS_FILE = path.join(process.cwd(), 'beta-emails.txt');

export async function storeBetaEmail(email: string) {
  await fs.appendFile(EMAILS_FILE, email + '\n', 'utf-8');
}

export async function readAllBetaEmails(): Promise<string[]> {
  try {
    const content = await fs.readFile(EMAILS_FILE, 'utf-8');
    return content.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

export async function clearBetaEmails() {
  await fs.writeFile(EMAILS_FILE, '', 'utf-8');
}
