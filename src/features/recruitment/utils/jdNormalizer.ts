/**
 * @file jdNormalizer.ts
 * @description Normalizes raw JD text, Markdown documents, or form data into a
 * structured, clean GeneratedJd model suitable for previews and database storage.
 */

import type { GeneratedJd, JdDomain } from '../types';

/**
 * Extracts bullet points from a markdown section.
 */
function extractBullets(text: string, sectionHeader: string): string[] {
  const regex = new RegExp(`##\\s*${sectionHeader}[\\s\\S]*?(?=(##|$))`, 'i');
  const match = text.match(regex);
  if (!match) return [];

  const lines = match[0].split('\n');
  return lines
    .filter((l) => /^\s*[-*•]\s+/.test(l))
    .map((l) => l.replace(/^\s*[-*•]\s+/, '').trim())
    .filter(Boolean);
}

/**
 * Extracts paragraph summary after the role heading.
 */
function extractSummary(text: string): string {
  const match = text.match(/##\s*About The Role\s*([\s\S]*?)(?=(##|$))/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return '';
}

/**
 * Extracts skills from skill tags or comma-separated lists.
 */
function extractSkills(text: string): string[] {
  const match = text.match(/##\s*Core Required Skills\s*([\s\S]*?)(?=(##|$))/i);
  if (!match || !match[1]) return [];

  const raw = match[1].replace(/[`•]/g, ',');
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 1);
}

/**
 * Normalizes any input JD (string, partial object, or formatted markdown) into a standardized GeneratedJd.
 */
export function normalizeJd(input: unknown): GeneratedJd {
  if (typeof input === 'string') {
    const lines = input.split('\n');
    const firstLine = lines.find((l) => l.startsWith('# ')) || '';
    const title = firstLine.replace(/^#\s*/, '').trim() || 'Untitled Job Position';

    const deptMatch = input.match(/\*\*Department:\*\*\s*([^*|\n]+)/i);
    const department = deptMatch ? deptMatch[1].trim() : 'General';

    const domainMatch = input.match(/\*\*Domain:\*\*\s*([^*|\n]+)/i);
    const domainRaw = (domainMatch ? domainMatch[1].trim().toLowerCase() : 'general') as JdDomain;

    const summary = extractSummary(input) || 'Job overview and requirements.';
    const responsibilities = extractBullets(input, 'Key Responsibilities');
    const requirements = extractBullets(input, 'Qualifications & Requirements');
    const benefits = extractBullets(input, 'Benefits & Perks');
    const skills = extractSkills(input);

    return {
      title,
      department,
      domain: domainRaw,
      summary,
      responsibilities: responsibilities.length > 0 ? responsibilities : ['Execute core job duties effectively.'],
      requirements: requirements.length > 0 ? requirements : ['Relevant industry experience required.'],
      benefits: benefits.length > 0 ? benefits : ['Competitive compensation & benefits.'],
      skills: skills.length > 0 ? skills : ['Communication', 'Teamwork'],
      markdown: input,
    };
  }

  if (typeof input === 'object' && input !== null) {
    const obj = input as Record<string, unknown>;
    const title = String(obj.title || obj.name || 'Untitled Position');
    const department = String(obj.department || 'General');
    const summary = String(obj.summary || obj.description || 'Job overview and responsibilities.');
    const responsibilities = Array.isArray(obj.responsibilities)
      ? obj.responsibilities.map(String)
      : typeof obj.responsibilities === 'string'
      ? obj.responsibilities.split('\n').filter(Boolean)
      : [];
    const requirements = Array.isArray(obj.requirements)
      ? obj.requirements.map(String)
      : typeof obj.requirements === 'string'
      ? obj.requirements.split('\n').filter(Boolean)
      : [];
    const benefits = Array.isArray(obj.benefits)
      ? obj.benefits.map(String)
      : typeof obj.benefits === 'string'
      ? obj.benefits.split('\n').filter(Boolean)
      : [];
    const skills = Array.isArray(obj.skills)
      ? obj.skills.map(String)
      : typeof obj.skills === 'string'
      ? obj.skills.split(',').map((s) => s.trim())
      : [];

    const markdown = `# ${title}
**Department:** ${department}

## About The Role
${summary}

## Key Responsibilities
${responsibilities.map((r) => `- ${r}`).join('\n')}

## Qualifications & Requirements
${requirements.map((r) => `- ${r}`).join('\n')}

## Core Required Skills
${skills.map((s) => `\`${s}\``).join(' • ')}

## Benefits & Perks
${benefits.map((b) => `- ${b}`).join('\n')}
`;

    return {
      title,
      department,
      domain: (obj.domain as JdDomain) || 'general',
      summary,
      responsibilities,
      requirements,
      benefits,
      skills,
      markdown,
    };
  }

  return {
    title: 'Untitled Position',
    department: 'General',
    domain: 'general',
    summary: 'No job description provided.',
    responsibilities: [],
    requirements: [],
    benefits: [],
    skills: [],
    markdown: '',
  };
}

