/**
 * @file documentGeneratorUtils.ts
 * @description Utility helpers for placeholder normalization, input type inference,
 * humanized labeling, and date formatting in the Document Generator module.
 */

/**
 * Strips template tokens like {{name}} or {name} to extract the raw variable key.
 */
export const cleanPlaceholderKey = (placeholder: string): string => {
  if (!placeholder) return '';
  return placeholder.replace(/[{}]/g, '').trim();
};

/**
 * Converts snake_case, camelCase, or kebab-case placeholder keys into human-friendly titles.
 * e.g. "employee_name" -> "Employee Name", "joiningDate" -> "Joining Date", "company-address" -> "Company Address".
 */
export const humanizePlaceholder = (placeholder: string): string => {
  const clean = cleanPlaceholderKey(placeholder);
  if (!clean) return 'Variable';

  // Replace underscores and hyphens with spaces
  let text = clean.replace(/[_-]+/g, ' ');

  // Insert space before capital letters in camelCase (e.g. employeeName -> employee Name)
  text = text.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Capitalize words
  return text
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Infers appropriate HTML input type based on the placeholder key semantics.
 */
export const getPlaceholderInputType = (key: string): 'date' | 'email' | 'number' | 'text' => {
  const clean = cleanPlaceholderKey(key).toLowerCase();

  // Tokenize by delimiter, camelCase transitions, or punctuation
  const tokens = clean
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  // Check date: word 'date', 'dob', ends with '_on', 'day', 'month', 'year', 'deadline'
  // Explicitly avoid matching substrings within unrelated words like "candidate"
  const isDate =
    tokens.includes('date') ||
    tokens.includes('dob') ||
    tokens.includes('deadline') ||
    tokens.includes('birthdate') ||
    clean.endsWith('_on') ||
    clean.endsWith('_date') ||
    clean === 'date';

  if (isDate) {
    return 'date';
  }

  // Check email
  const isEmail = tokens.includes('email') || tokens.includes('mail') || clean.includes('email');
  if (isEmail) {
    return 'email';
  }

  // Check number / monetary
  const numberKeywords = [
    'salary',
    'ctc',
    'amount',
    'compensation',
    'bonus',
    'allowance',
    'rate',
    'count',
    'stipend',
  ];

  if (
    tokens.some((t) => numberKeywords.includes(t)) ||
    numberKeywords.some((kw) => clean.includes(kw))
  ) {
    return 'number';
  }

  return 'text';
};

/**
 * Formats ISO timestamps into human-readable date strings.
 */
export const formatDocumentDate = (isoString?: string | null): string => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
};
