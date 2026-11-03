import { describe, it, expect } from 'vitest';
import { generateSmartJd, modifyJdWithInstruction, DOMAIN_BLUEPRINTS } from '../utils/smartJdGenerator';
import { normalizeJd } from '../utils/jdNormalizer';
import type { JdDomain } from '../types';

describe('Smart JD Generator across all 14 domains', () => {
  const domains: JdDomain[] = [
    'hr',
    'sales',
    'marketing',
    'finance',
    'operations',
    'support',
    'healthcare',
    'design',
    'education',
    'legal',
    'admin',
    'data',
    'engineering',
    'general',
  ];

  it('contains configurations for all 14 domains in DOMAIN_BLUEPRINTS', () => {
    expect(Object.keys(DOMAIN_BLUEPRINTS)).toHaveLength(14);
    for (const d of domains) {
      expect(DOMAIN_BLUEPRINTS[d]).toBeDefined();
      expect(DOMAIN_BLUEPRINTS[d].department).toBeTruthy();
      expect(DOMAIN_BLUEPRINTS[d].defaultSkills.length).toBeGreaterThan(0);
    }
  });

  domains.forEach((domain) => {
    it(`generates a complete valid JD for domain "${domain}"`, () => {
      const jd = generateSmartJd({
        role: `${domain.toUpperCase()} Specialist`,
        domain,
        experienceLevel: 'senior',
        workMode: 'Hybrid',
        location: 'Bengaluru, India',
        customSkills: ['CustomSkillX'],
      });

      expect(jd.title).toContain('Senior');
      expect(jd.department).toBeTruthy();
      expect(jd.domain).toBe(domain);
      expect(jd.responsibilities.length).toBeGreaterThan(2);
      expect(jd.requirements.length).toBeGreaterThan(2);
      expect(jd.benefits.length).toBeGreaterThan(1);
      expect(jd.skills).toContain('CustomSkillX');
      expect(jd.markdown).toContain('# Senior');
      expect(jd.markdown).toContain('## Key Responsibilities');
      expect(jd.markdown).toContain('## Qualifications & Requirements');
    });
  });

  it('modifies an existing JD according to natural language instructions', () => {
    const initialJd = `# Senior Software Engineer
**Department:** Engineering | **Work Mode:** Onsite

## About The Role
Build scalable web applications.

## Key Responsibilities
- Write clean modular code.

## Core Required Skills
\`TypeScript\` • \`React\`

## Benefits & Perks
- Health Insurance
`;

    // 1. Remote instruction
    const remoteJd = modifyJdWithInstruction(initialJd, 'Make it fully remote');
    expect(remoteJd).toContain('**Work Mode:** Remote');
    expect(remoteJd).toContain('100% Work from Home');

    // 2. AI instruction
    const aiJd = modifyJdWithInstruction(initialJd, 'Add generative AI and prompt engineering skills');
    expect(aiJd).toContain('Generative AI');

    // 3. Mentorship instruction
    const leadJd = modifyJdWithInstruction(initialJd, 'Add leadership and mentorship responsibilities');
    expect(leadJd).toContain('Mentor early-career engineers');
  });
});

describe('JD Normalizer', () => {
  it('normalizes markdown string into structured GeneratedJd model', () => {
    const rawMarkdown = `# Staff Platform Architect
**Department:** Cloud Infrastructure | **Domain:** ENGINEERING

## About The Role
Direct cloud platform engineering and multi-region resilience.

## Key Responsibilities
- Architect Kubernetes clusters.
- Optimize multi-cloud disaster recovery.

## Qualifications & Requirements
- 10+ years in distributed systems.
- Deep expertise in Terraform and Go.

## Core Required Skills
\`Kubernetes\` • \`Terraform\` • \`Go\`

## Benefits & Perks
- Top-tier compensation
- Remote setup grant
`;

    const normalized = normalizeJd(rawMarkdown);
    expect(normalized.title).toBe('Staff Platform Architect');
    expect(normalized.department).toBe('Cloud Infrastructure');
    expect(normalized.domain).toBe('engineering');
    expect(normalized.responsibilities).toContain('Architect Kubernetes clusters.');
    expect(normalized.requirements).toContain('10+ years in distributed systems.');
    expect(normalized.skills).toContain('Kubernetes');
    expect(normalized.skills).toContain('Terraform');
  });

  it('normalizes partial object into structured GeneratedJd model', () => {
    const partial = {
      title: 'DevOps Engineer',
      department: 'Platform',
      summary: 'Automate deployment pipelines',
      responsibilities: ['Build CI/CD pipelines', 'Monitor SLOs'],
      skills: ['AWS', 'Docker'],
    };

    const normalized = normalizeJd(partial);
    expect(normalized.title).toBe('DevOps Engineer');
    expect(normalized.department).toBe('Platform');
    expect(normalized.responsibilities).toHaveLength(2);
    expect(normalized.markdown).toContain('# DevOps Engineer');
  });
});

