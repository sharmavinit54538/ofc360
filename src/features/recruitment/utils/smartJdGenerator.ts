/**
 * @file smartJdGenerator.ts
 * @description Domain-driven Smart Job Description Generator supporting 14 distinct
 * industry verticals with role-specific responsibilities, requirements, and benefits.
 */

import type { JdDomain, JdExperienceLevel, GeneratedJd, SmartJdConfig } from '../types';

interface DomainBlueprint {
  department: string;
  defaultSkills: string[];
  roleTemplates: Record<string, { summary: string; responsibilities: string[]; requirements: string[] }>;
  commonResponsibilities: string[];
  commonRequirements: string[];
  commonBenefits: string[];
}

export const DOMAIN_BLUEPRINTS: Record<JdDomain, DomainBlueprint> = {
  hr: {
    department: 'Human Resources',
    defaultSkills: ['Talent Acquisition', 'HRBP', 'Employee Relations', 'HRIS', 'Labor Compliance', 'Performance Management'],
    roleTemplates: {
      default: {
        summary: 'Lead end-to-end human resource operations, employee lifecycle management, talent strategy, and workplace culture initiatives.',
        responsibilities: [
          'Design and execute talent acquisition strategies aligned with organizational hiring targets.',
          'Manage employee relations, grievance handling, and performance appraisal cycles.',
          'Oversee compliance with statutory regulations, labor laws, and internal HR policies.',
          'Implement learning and development frameworks to foster employee career growth.',
        ],
        requirements: [
          'Demonstrated expertise in human resource management and employment law compliance.',
          'Hands-on experience with modern HRIS, payroll, and ATS systems.',
          'Strong interpersonal, negotiation, and conflict-resolution capabilities.',
        ],
      },
    },
    commonResponsibilities: [
      'Foster inclusive workplace culture and champion employee wellness programs.',
      'Analyze employee engagement metrics and deliver data-backed retention initiatives.',
    ],
    commonRequirements: [
      'Bachelor’s or Master’s degree in Human Resources, Business Administration, or related discipline.',
      'Proficiency in HR analytics and statutory reporting.',
    ],
    commonBenefits: ['Comprehensive Health Coverage', 'Mental Wellness Stipend', 'Flexible Remote Policy', 'Professional Certifications Fund'],
  },

  sales: {
    department: 'Sales & Revenue',
    defaultSkills: ['B2B Sales', 'CRM (Salesforce/HubSpot)', 'Pipeline Management', 'Cold Outreach', 'Contract Negotiation', 'Lead Qualification'],
    roleTemplates: {
      default: {
        summary: 'Drive revenue growth by hunting new client accounts, managing sales pipelines, and closing enterprise contracts.',
        responsibilities: [
          'Identify and prospect high-potential enterprise leads across target industry verticals.',
          'Conduct product demonstrations, commercial pitches, and value-focused presentations.',
          'Negotiate enterprise contract terms, pricing structures, and master service agreements.',
          'Consistently achieve and exceed quarterly sales revenue quotas and pipeline velocity targets.',
        ],
        requirements: [
          'Proven track record of quota attainment in SaaS or high-growth B2B enterprise sales.',
          'Mastery of consultative selling frameworks (e.g., MEDDPICC, Challenger, SPIN).',
          'Excellent executive communication, storytelling, and relationship-building acumen.',
        ],
      },
    },
    commonResponsibilities: [
      'Maintain CRM accuracy across lead lifecycle stages, forecasts, and conversion analytics.',
      'Collaborate with Product Marketing to refine positioning and competitive battlecards.',
    ],
    commonRequirements: ['Proven track record in high-velocity sales environments.', 'Strong analytical mindset and CRM proficiency.'],
    commonBenefits: ['Uncapped Commission Structure', 'Quarterly Sales Incentives', 'Travel & Client Dining Allowance', 'Executive Coaching'],
  },

  marketing: {
    department: 'Marketing & Brand',
    defaultSkills: ['Growth Marketing', 'SEO/SEM', 'Content Strategy', 'Demand Generation', 'Analytics', 'Social Media Campaigning'],
    roleTemplates: {
      default: {
        summary: 'Spearhead omnichannel growth, brand awareness, content marketing, and inbound demand generation pipelines.',
        responsibilities: [
          'Formulate and execute multi-channel growth campaigns spanning paid, organic, and referral channels.',
          'Analyze customer acquisition cost (CAC), conversion funnels, and marketing ROI analytics.',
          'Direct brand messaging, thought-leadership content, and product launch marketing campaigns.',
          'Manage SEO, content syndication, email newsletters, and webinars.',
        ],
        requirements: [
          'Demonstrated experience in growth marketing, performance advertising, or content marketing.',
          'Familiarity with Google Analytics, SEMrush, HubSpot, and marketing automation tools.',
          'Exceptional written, visual, and verbal storytelling abilities.',
        ],
      },
    },
    commonResponsibilities: [
      'Coordinate with Sales and Product teams to align lead scoring and account-based marketing.',
      'A/B test landing pages and creative assets to maximize funnel throughput.',
    ],
    commonRequirements: ['Degree in Marketing, Communications, or quantitative fields.', 'Data-driven mindset with test-and-learn orientation.'],
    commonBenefits: ['Creative Tools Stipend', 'Conference Attendance Budget', 'Hybrid Work Flexibility', 'Home Office Allowance'],
  },

  finance: {
    department: 'Finance & Accounts',
    defaultSkills: ['Financial Modeling', 'Statutory Compliance', 'FP&A', 'GST & TDS', 'Budgeting', 'Auditing'],
    roleTemplates: {
      default: {
        summary: 'Own financial planning, fiscal compliance, budgeting, cash flow forecasting, and statutory tax governance.',
        responsibilities: [
          'Oversee general ledger, reconciliation, accounts payable/receivable, and month-end financial closing.',
          'Prepare five-year financial forecasts, operating budgets, and variance analysis reports.',
          'Ensure strict adherence to tax regulations including GST, TDS, EPF, ESI, and corporate filings.',
          'Coordinate statutory audits with external audit teams and tax consultants.',
        ],
        requirements: [
          'CA, CPA, CFA, or Master’s in Finance with solid accounting credentials.',
          'Strong mastery of Advanced Excel, ERPs (SAP/Tally/NetSuite), and financial modeling.',
          'Uncompromising integrity and meticulous attention to financial detail.',
        ],
      },
    },
    commonResponsibilities: [
      'Monitor cash burn rate and runway metrics to support executive capital allocation.',
      'Optimize cost structures and recommend fiscal operational efficiencies.',
    ],
    commonRequirements: ['Proven track record in corporate finance or accounting firms.', 'Deep understanding of Indian & International GAAP.'],
    commonBenefits: ['Performance Bonus Pool', 'Comprehensive Term Life Insurance', 'Stock Options (ESOP)', 'Financial Planning Assistance'],
  },

  operations: {
    department: 'Operations',
    defaultSkills: ['Process Optimization', 'Supply Chain', 'Vendor Management', 'SLA Tracking', 'Lean Six Sigma', 'ERP Systems'],
    roleTemplates: {
      default: {
        summary: 'Drive business efficiency, resource allocation, vendor contracts, and continuous operational excellence.',
        responsibilities: [
          'Standardize business workflows to eradicate operational bottlenecks and improve SLAs.',
          'Manage strategic vendor relationships, procurement negotiations, and performance SLAs.',
          'Analyze cross-functional metrics to scale service delivery and departmental execution.',
          'Oversee facilities, administrative logistics, and business continuity protocols.',
        ],
        requirements: [
          'Demonstrated operational leadership experience in high-growth organizational environments.',
          'Strong analytical acumen with Lean, Agile, or Six Sigma problem-solving exposure.',
          'Exceptional stakeholder alignment and project execution skills.',
        ],
      },
    },
    commonResponsibilities: [
      'Document Standard Operating Procedures (SOPs) and automate repetitive workflows.',
      'Coordinate emergency response and infrastructure disaster preparedness.',
    ],
    commonRequirements: ['Bachelor’s degree in Business, Engineering, or relevant domain.', 'Hands-on project management certification (PMP/Scrum).'],
    commonBenefits: ['Wellness Package', 'Annual Performance Bonus', 'Subsidized Daily Meals', 'Equipment Modernization Grant'],
  },

  support: {
    department: 'Customer Support & Success',
    defaultSkills: ['Help Desk', 'Zendesk / Freshdesk', 'Incident Management', 'Customer Empathy', 'SLA Adherence', 'Technical Troubleshooting'],
    roleTemplates: {
      default: {
        summary: 'Deliver world-class technical and customer support, resolve tickets, and maximize customer satisfaction (CSAT).',
        responsibilities: [
          'Resolve customer inquiries via chat, email, and phone within strict SLA guidelines.',
          'Investigate product issues, reproduce bugs, and coordinate hotfixes with Engineering.',
          'Author customer-facing knowledge base articles, troubleshooting FAQs, and video guides.',
          'Monitor CSAT, First Response Time (FRT), and First Contact Resolution (FCR) metrics.',
        ],
        requirements: [
          'Experience in customer support or client advocacy for tech or SaaS products.',
          'Superb written communication, active listening, and problem-solving patience.',
          'Familiarity with help desk ticketing tools, CRM software, and bug tracking systems.',
        ],
      },
    },
    commonResponsibilities: [
      'Advocate for client feedback during sprint planning and product feature prioritizations.',
      'Participate in rotating weekend on-call support escalation rosters.',
    ],
    commonRequirements: ['Customer-centric attitude with strong resilience under pressure.', 'Fluent written and verbal English communication.'],
    commonBenefits: ['Shift Allowance & Night Cab Support', 'Internet & Ergonomic Reimbursement', 'Annual Retention Incentive', 'Wellness Program'],
  },

  healthcare: {
    department: 'Healthcare & Clinical Services',
    defaultSkills: ['Patient Care', 'HIPAA Compliance', 'Electronic Health Records (EHR)', 'Clinical Diagnostics', 'Medical Ethics', 'Triage'],
    roleTemplates: {
      default: {
        summary: 'Provide patient-centered clinical expertise, uphold health regulations, and ensure clinical excellence.',
        responsibilities: [
          'Deliver clinical consultations, health assessments, and individualized care regimens.',
          'Maintain precise Electronic Medical Records (EMR) in compliance with HIPAA/statutory norms.',
          'Collaborate with multidisciplinary healthcare teams to optimize patient outcomes.',
          'Uphold clinical hygiene, protocol standards, and emergency preparedness measures.',
        ],
        requirements: [
          'Recognized medical/nursing/healthcare degree with valid state licensure/registration.',
          'Experience in hospital, clinical practice, or telemedicine setups.',
          'Deep commitment to medical ethics, patient confidentiality, and empathetic care.',
        ],
      },
    },
    commonResponsibilities: [
      'Educate patients and families on preventive healthcare measures.',
      'Participate in continuous medical education (CME) and clinical audits.',
    ],
    commonRequirements: ['Active Medical Council or Nursing Council license.', 'Strong clinical diagnostic and empathetic bedside manner.'],
    commonBenefits: ['Medical Malpractice Insurance Coverage', 'Continuing Education Allowance', 'Comprehensive Family Health Cover', 'Flexible Shift Rosters'],
  },

  design: {
    department: 'Design & Creative',
    defaultSkills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design'],
    roleTemplates: {
      default: {
        summary: 'Craft intuitive, aesthetically polished user interfaces and scalable design systems for web and mobile platforms.',
        responsibilities: [
          'Conduct qualitative user research, usability testing, and persona interviews.',
          'Architect end-to-end user flows, wireframes, high-fidelity prototypes, and design specs in Figma.',
          'Maintain and evolve the unified Design System across web and native mobile apps.',
          'Partner closely with Product Managers and Frontend Engineers to ensure design fidelity.',
        ],
        requirements: [
          'Strong design portfolio showcasing shipped web/mobile applications and UX problem-solving.',
          'Deep expertise in Figma, auto-layout, interactive component variants, and prototyping.',
          'Clear understanding of accessibility (WCAG 2.1 AA) and modern web UI ergonomics.',
        ],
      },
    },
    commonResponsibilities: [
      'Facilitate design sprints, brainstorm sessions, and cross-functional critique sessions.',
      'Refine micro-interactions and animations to deliver delightful user experiences.',
    ],
    commonRequirements: ['Degree in Interaction Design, HCI, Graphic Design, or equivalent portfolio evidence.', 'Ability to articulate design decisions with data.'],
    commonBenefits: ['Top-spec Apple Silicon Hardware', 'Figma & Design Software Subscriptions', 'Annual Design Conference Ticket', 'Unlimited Books Grant'],
  },

  education: {
    department: 'Learning & Education',
    defaultSkills: ['Curriculum Design', 'Instructional Design', 'Pedagogy', 'EdTech LMS', 'Student Assessment', 'Mentorship'],
    roleTemplates: {
      default: {
        summary: 'Develop engaging educational curricula, deliver instructional courses, and mentor learners toward career milestones.',
        responsibilities: [
          'Design structured course syllabi, interactive lesson plans, and practical assignments.',
          'Deliver dynamic lectures, live coding/masterclasses, and one-on-one mentorship sessions.',
          'Evaluate learner progress, create assessments, and provide personalized constructive feedback.',
          'Iterate on course materials based on learner feedback and industry skill demands.',
        ],
        requirements: [
          'Demonstrated teaching, instructional design, or corporate training background.',
          'Passion for mentorship and ability to explain complex concepts with clarity.',
          'Experience with Learning Management Systems (Canvas, Moodle, Coursera, etc.).',
        ],
      },
    },
    commonResponsibilities: [
      'Facilitate collaborative student group projects and peer code reviews.',
      'Author assessments and project grading rubrics.',
    ],
    commonRequirements: ['Subject-matter degree or industry credential.', 'Strong presentation and interpersonal mentorship skills.'],
    commonBenefits: ['Sabbatical & Research Time', 'Tuition Assistance Program', 'Flexible Teaching Rosters', 'Book & Learning Material Stipend'],
  },

  legal: {
    department: 'Legal & Corporate Affairs',
    defaultSkills: ['Contract Drafting', 'Regulatory Compliance', 'Intellectual Property', 'Dispute Resolution', 'Corporate Governance', 'Data Privacy (GDPR/DPDP)'],
    roleTemplates: {
      default: {
        summary: 'Oversee corporate legal risk, contract negotiations, regulatory compliance, data privacy, and intellectual property.',
        responsibilities: [
          'Draft, review, and negotiate enterprise SaaS agreements, vendor contracts, and NDAs.',
          'Ensure strict compliance with DPDP, GDPR, labor regulations, and corporate law.',
          'Safeguard company intellectual property including trademarks, patents, and trade secrets.',
          'Advise executive management on legal liabilities, litigation risks, and corporate governance.',
        ],
        requirements: [
          'LLB or LLM degree with active bar enrollment and corporate law experience.',
          'Extensive background in commercial tech contracts and data privacy laws.',
          'Exceptional legal drafting, analytical precision, and negotiation acumen.',
        ],
      },
    },
    commonResponsibilities: [
      'Maintain digital contract repository and ensure timely renewals.',
      'Provide rapid legal triage for vendor security audits and corporate transactions.',
    ],
    commonRequirements: ['Bar Council registration in good standing.', 'Meticulous legal risk assessment skills.'],
    commonBenefits: ['Bar Association Dues Covered', 'Comprehensive Legal Research Subscriptions', 'Corporate Indemnity Cover', 'Flexible Remote Options'],
  },

  admin: {
    department: 'Administration & Facilities',
    defaultSkills: ['Office Administration', 'Vendor Management', 'Facility Maintenance', 'Asset Tracking', 'Procurement', 'Event Coordination'],
    roleTemplates: {
      default: {
        summary: 'Manage daily office operations, facilities, vendor supplies, asset distribution, and company-wide workplace logistics.',
        responsibilities: [
          'Ensure smooth daily office operations, workplace cleanliness, and facility safety.',
          'Manage vendor contracts for stationery, refreshments, housekeeping, and security.',
          'Coordinate asset handovers, inventory tracking, and onboarding welcome kits.',
          'Plan and execute company celebrations, offsites, and internal team engagement events.',
        ],
        requirements: [
          'Proven administrative management experience in corporate office settings.',
          'Strong organizational, multi-tasking, and vendor management capabilities.',
          'Prompt crisis-handling attitude and warm professional presence.',
        ],
      },
    },
    commonResponsibilities: [
      'Maintain office inventory spreadsheets and coordinate replenishment orders.',
      'Supervise on-premise security, access badge issuance, and visitor log compliance.',
    ],
    commonRequirements: ['Bachelor’s degree or relevant administrative experience.', 'Proficiency in MS Office and asset tracking portals.'],
    commonBenefits: ['Daily Meal & Travel Allowance', 'Annual Festival Bonuses', 'Healthcare Coverage', 'Skill Training Sponsorship'],
  },

  data: {
    department: 'Data & Analytics',
    defaultSkills: ['SQL', 'Python / R', 'Data Warehousing (Snowflake/BigQuery)', 'dbt', 'Tableau / PowerBI', 'Data Modeling', 'ETL Pipelines'],
    roleTemplates: {
      default: {
        summary: 'Transform raw data into strategic business insights, build scalable data models, and maintain analytics pipelines.',
        responsibilities: [
          'Architect robust data models and automated ETL/ELT pipelines in modern data warehouses.',
          'Build self-service BI dashboards and KPIs to empower cross-department decision making.',
          'Perform deep-dive exploratory data analyses to uncover growth opportunities and churn drivers.',
          'Maintain data hygiene, catalog documentation, and automated pipeline quality testing.',
        ],
        requirements: [
          'Demonstrated expertise in advanced SQL, Python for data manipulation, and dimensional data modeling.',
          'Hands-on experience with cloud data warehouses (Snowflake, BigQuery) and BI visualization tools.',
          'Solid understanding of statistical inference, A/B testing frameworks, and metric definition.',
        ],
      },
    },
    commonResponsibilities: [
      'Partner with Product and Engineering to instrument event logging and tracking schemas.',
      'Optimize query costs and streamline dashboard load performance.',
    ],
    commonRequirements: ['Degree in Computer Science, Statistics, Mathematics, or equivalent practical experience.', 'Strong quantitative and business storytelling skills.'],
    commonBenefits: ['Cloud Sandbox Budget', 'Conference Sponsorship', 'High-performance Workstation', 'Remote-First Culture'],
  },

  engineering: {
    department: 'Engineering & Technology',
    defaultSkills: ['TypeScript', 'React', 'Node.js / Python', 'System Design', 'PostgreSQL', 'Docker / Kubernetes', 'CI/CD Pipelines', 'REST & GraphQL'],
    roleTemplates: {
      default: {
        summary: 'Architect, develop, and deploy scalable software systems with robust performance, security, and test coverage.',
        responsibilities: [
          'Design and implement mission-critical web applications, distributed APIs, and microservices.',
          'Write clean, modular, and maintainable code backed by rigorous unit, integration, and E2E tests.',
          'Participate actively in architectural reviews, RFC design docs, and constructive code reviews.',
          'Optimize application performance, database queries, and cloud resource utilization.',
        ],
        requirements: [
          'Solid foundation in data structures, algorithms, system design, and software engineering principles.',
          'Production experience with modern frontend (React/TypeScript) and backend (FastAPI/Node.js/Go) frameworks.',
          'Familiarity with containerized deployments (Docker), CI/CD pipelines, and relational databases.',
        ],
      },
    },
    commonResponsibilities: [
      'Monitor production services, investigate alerts, and participate in blameless post-mortem retrospectives.',
      'Champion engineering best practices, automated linting, and security vulnerability scanning.',
    ],
    commonRequirements: ['Degree in Computer Science or equivalent practical software engineering experience.', 'Commitment to high-quality code craftsmanship.'],
    commonBenefits: ['Top-spec Developer Machine (M3 Max / ThinkPad P-Series)', 'Generous Home Office Stipend', 'Tech Book & Course Subscriptions', 'Flexible Working Hours'],
  },

  general: {
    department: 'General Management',
    defaultSkills: ['Project Management', 'Stakeholder Communication', 'Strategic Planning', 'Problem Solving', 'Documentation', 'Agile Methodologies'],
    roleTemplates: {
      default: {
        summary: 'Drive strategic initiatives, facilitate cross-functional alignment, and oversee project delivery across departments.',
        responsibilities: [
          'Lead cross-functional initiatives from ideation through successful execution.',
          'Coordinate project timelines, resource allocation, and stakeholder status updates.',
          'Identify risks, remove team blockers, and optimize operational velocity.',
          'Author concise reports and executive summaries for leadership review.',
        ],
        requirements: [
          'Demonstrated leadership in project delivery or general operational management.',
          'Outstanding written and verbal communication and organizational prowess.',
          'Ability to thrive in fast-paced environments with ambiguous problem spaces.',
        ],
      },
    },
    commonResponsibilities: [
      'Facilitate weekly milestone standups and project retrospective sessions.',
      'Maintain centralized documentation repositories in Confluence / Notion.',
    ],
    commonRequirements: ['Bachelor’s degree or relevant professional experience.', 'Proactive problem solver with high ownership.'],
    commonBenefits: ['Comprehensive Health Plan', 'Annual Performance Bonus', 'Hybrid Flexibility', 'Continuous Learning Fund'],
  },
};

const EXPERIENCE_MODIFIERS: Record<JdExperienceLevel, { prefix: string; years: string; focus: string }> = {
  entry: {
    prefix: 'Associate / Junior',
    years: '0 - 2 years',
    focus: 'Focus on learning core methodologies, executing defined tasks, and collaborating with senior peers.',
  },
  mid: {
    prefix: '',
    years: '3 - 5 years',
    focus: 'Focus on independent execution, delivering robust outcomes, and mentoring early-career team members.',
  },
  senior: {
    prefix: 'Senior',
    years: '5 - 8 years',
    focus: 'Focus on strategic execution, technical leadership, complex problem solving, and driving cross-team impact.',
  },
  lead: {
    prefix: 'Lead',
    years: '8 - 12 years',
    focus: 'Focus on organizational architecture, people mentorship, cross-department alignment, and multi-quarter roadmaps.',
  },
  executive: {
    prefix: 'Head of / Director of',
    years: '12+ years',
    focus: 'Focus on executive vision, departmental budget ownership, corporate strategy, and talent scaling.',
  },
};

/**
 * Generates a fully fleshed-out, domain-specific Job Description in both structured and Markdown format.
 */
export function generateSmartJd(config: SmartJdConfig): GeneratedJd {
  const blueprint = DOMAIN_BLUEPRINTS[config.domain] || DOMAIN_BLUEPRINTS.general;
  const modifier = EXPERIENCE_MODIFIERS[config.experienceLevel] || EXPERIENCE_MODIFIERS.mid;

  const roleTitle = config.role.trim();
  const title = modifier.prefix
    ? `${modifier.prefix} ${roleTitle}`.replace(/^Senior Senior/, 'Senior').replace(/^Lead Lead/, 'Lead')
    : roleTitle;

  const department = blueprint.department;
  const skills = Array.from(new Set([...(config.customSkills || []), ...blueprint.defaultSkills])).slice(0, 8);

  const baseTemplate = blueprint.roleTemplates.default;
  const summary = `${baseTemplate.summary} This is a ${config.workMode.toLowerCase()} role based in ${
    config.location || 'our headquarters / remote'
  }. Ideal candidate has ${modifier.years} of experience. ${modifier.focus}`;

  const responsibilities = [
    ...baseTemplate.responsibilities,
    ...blueprint.commonResponsibilities,
  ];

  const requirements = [
    `Minimum ${modifier.years} of relevant industry experience in ${blueprint.department.toLowerCase()} or related areas.`,
    ...baseTemplate.requirements,
    ...blueprint.commonRequirements,
    `Proficiency with core industry tools: ${skills.slice(0, 4).join(', ')}.`,
  ];

  const benefits = [
    ...blueprint.commonBenefits,
    config.workMode === 'Remote' ? '100% Remote Flexibility with Coworking Access' : 'Modern Ergonomic Office Environment',
  ];

  const markdown = `# ${title}
**Department:** ${department} | **Domain:** ${config.domain.toUpperCase()} | **Work Mode:** ${config.workMode} | **Experience:** ${modifier.years}

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
    domain: config.domain,
    summary,
    responsibilities,
    requirements,
    benefits,
    skills,
    markdown,
  };
}

/**
 * Modifies an existing JD based on natural language instructions (OFC360 Copilot).
 */
export function modifyJdWithInstruction(currentJd: string, instruction: string): string {
  const trimmedInstruction = instruction.trim().toLowerCase();

  // Heuristic adjustments based on intent
  if (trimmedInstruction.includes('remote') || trimmedInstruction.includes('work from home')) {
    return currentJd
      .replace(/\*\*Work Mode:\*\* [A-Za-z]+/i, '**Work Mode:** Remote')
      .replace(/## Benefits & Perks/i, '## Benefits & Perks\n- 100% Work from Home with Home Office Reimbursement');
  }

  if (trimmedInstruction.includes('salary') || trimmedInstruction.includes('compensation') || trimmedInstruction.includes('competitive')) {
    return `${currentJd}\n- Highly competitive compensation benchmarked against top 90th percentile industry peers.\n`;
  }

  if (trimmedInstruction.includes('lead') || trimmedInstruction.includes('mentorship') || trimmedInstruction.includes('senior')) {
    return currentJd.replace(
      /## Key Responsibilities/i,
      '## Key Responsibilities\n- Mentor early-career engineers and conduct technical design reviews.\n- Drive architectural alignment across cross-functional squads.'
    );
  }

  if (trimmedInstruction.includes('ai') || trimmedInstruction.includes('genai') || trimmedInstruction.includes('machine learning')) {
    return currentJd.replace(
      /## Core Required Skills/i,
      '## Core Required Skills\n`Generative AI` • `LLM Integration` • `Prompt Engineering` • '
    );
  }

  // Fallback: append note
  return `${currentJd.trim()}\n\n> *Note: Updated per instruction: "${instruction.trim()}"*\n`;
}

