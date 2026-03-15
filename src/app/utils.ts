import { Transaction } from './types';

export const EXCHANGE_RATES: Record<string, number> = {
  CAD: 1,
  USD: 0.74,
  EUR: 0.68,
  GBP: 0.57,
};

export const CURRENCY_META: Record<string, { symbol: string; label: string }> = {
  CAD: { symbol: 'CA$', label: 'CA$ • CAD' },
  USD: { symbol: '$', label: '$ • USD' },
  EUR: { symbol: '€', label: '€ • EUR' },
  GBP: { symbol: '£', label: '£ • GBP' },
};

export const convertFromCad = (value: number, currency: string) => value * (EXCHANGE_RATES[currency] ?? 1);

export const formatMoney = (valueCad: number, currency: string) => {
  const converted = convertFromCad(valueCad, currency);
  return `${CURRENCY_META[currency]?.symbol ?? 'CA$'}${converted.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: converted % 1 ? 2 : 0 })}`;
};

export const formatDateLong = (dateStr: string, locale: 'en' | 'fr' = 'en') => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const exportTransactionsCsv = (transactions: Transaction[]) => {
  const header = 'date,merchant,amount,category,subCategory,recurring\n';
  const rows = transactions
    .map((t) => [t.date, t.merchant, t.amount, t.category, t.subCategory ?? '', t.recurring ? 'yes' : 'no']
      .map((v) => `"${String(v).replaceAll('"', '""')}"`).join(','))
    .join('\n');
  downloadBlob(new Blob([header + rows], { type: 'text/csv;charset=utf-8' }), 'transactions.csv');
};

export const exportJson = (data: unknown, fileName: string) => {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), fileName);
};

export const exportSimplePdf = (title: string, lines: string[], fileName: string) => {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const contentLines = [
    'BT',
    '/F1 16 Tf',
    '50 790 Td',
    `(${esc(title)}) Tj`,
    '/F1 10 Tf',
    ...lines.flatMap((line, index) => [`50 ${770 - index * 14} Td`, `(${esc(line)}) Tj`]),
    'ET',
  ].join('\n');

  const objects = [
    '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj',
    '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj',
    '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj',
    '4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj',
    `5 0 obj << /Length ${contentLines.length} >> stream\n${contentLines}\nendstream endobj`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) {
    offsets.push(pdf.length);
    pdf += object + '\n';
  }
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  downloadBlob(new Blob([pdf], { type: 'application/pdf' }), fileName);
};
