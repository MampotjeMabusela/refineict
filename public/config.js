// EDIT THIS FILE to change company details, numbers, logo and images. No other file needs touching.
window.SITE = {
  name: 'Refine ICT',
  legalName: 'RefineICT Pty (Ltd).', // header & footer only
  registrationNumber: '2024/130026/07',
  tagline: 'Advancing the frontiers of global connectivity',
  logo: '/img/logo.png',
  logoDark: '/img/logo.png', // same lockup works on light & dark (navy plate + white type)
  email: 'mattheomt@refineict.com',
  phone: '082 978 7832',
  whatsapp: '+27829787832',
  address: 'Gauteng, South Africa.',
  hours: 'Mon–Fri 08:00–17:00 · Emergency support 24/7',
  url: 'https://refineict.co.za',
  heroLead:
    "Fixed-price IT support, cloud, security and software for businesses that can't afford downtime.",
  statusLine: 'All client systems operational',
  stats: [
    { value: 12, suffix: '+', label: 'Years in business' },
    { value: 10, suffix: '+', label: 'Clients supported' },
    { value: 99.9, suffix: '%', label: 'Uptime delivered' },
    { value: 15, suffix: ' min', label: 'Average response time' },
  ],
  images: {
    heroBg: {
      src: 'img/hero-bg.webp',
      fallback: 'img/hero-bg.jpg',
      w: 2560,
      h: 1398,
      alt: 'Refine ICT — advancing the frontiers of global connectivity',
    },
    hero: { src: 'img/hero.webp', w: 1800, h: 1350, alt: 'Server infrastructure managed by our engineers' },
    about: {
      src: 'img/about.webp',
      fallback: 'img/about.png',
      w: 2400,
      h: 1310,
      alt: 'Engineers who treat your systems as their own — Refine ICT team at work',
    },
    security: {
      src: 'img/security.webp',
      fallback: 'img/security.jpg',
      w: 2400,
      h: 1310,
      alt: 'Security that works while you sleep — 24/7 home and business protection',
    },
    network: { src: 'img/network.webp', w: 1800, h: 1350, alt: 'Global network connectivity' },
    contactBg: {
      src: 'img/contact-bg.webp',
      fallback: 'img/contact-bg.jpg',
      w: 2560,
      h: 1398,
      alt: 'Refine ICT — advancing the frontiers of global connectivity',
    },
    aboutBg: {
      src: 'img/about-bg.webp',
      fallback: 'img/about-bg.jpg',
      w: 2560,
      h: 1044,
      alt: 'Refine ICT engineer working across network and systems monitors',
    },
    contactCloud: {
      src: 'img/contact-cloud.webp',
      fallback: 'img/contact-cloud.jpg',
      w: 1920,
      h: 939,
      alt: 'Cloud Services — architecture, migration, management, and cost control',
    },
    servicesBg: {
      src: 'img/services-bg.webp',
      fallback: 'img/services-bg.jpg',
      w: 3200,
      h: 2272,
      alt: 'Refine ICT services overview — managed IT, cloud, support, software, consulting and communications',
    },
    faq: {
      src: 'img/faq.webp',
      fallback: 'img/faq.png',
      w: 2400,
      h: 1646,
      alt: 'Frequently asked questions — person reviewing FAQ information on a screen',
    },
  },
  nav: [
    { href: '/services.html', label: 'Services' },
    { href: '/about.html', label: 'About' },
    { href: '/contact.html', label: 'Contact' },
  ],
  cta: { label: 'Get a quote', href: '/contact.html' },
  services: [
    {
      slug: 'managed-it-support',
      title: 'Managed IT Support',
      short: 'Helpdesk, monitoring and maintenance for every device, for a fixed monthly fee.',
      description:
        'A dedicated helpdesk, proactive monitoring and scheduled maintenance keep every workstation, server and cloud app healthy. You get a fixed monthly fee, clear SLAs and a named account engineer.',
      features: ['24/7 monitoring & alerting', 'Remote & on-site helpdesk', 'Patch & asset management', 'Monthly health reports'],
      heroImage: {
        src: '/img/service-managed-it.webp',
        fallback: '/img/service-managed-it.png',
        w: 2560,
        h: 1440,
        alt: 'Managed IT Services — global network health operations centre',
      },
    },
    {
      slug: 'cybersecurity',
      title: 'Cybersecurity',
      short: 'Firewalls, endpoint protection, penetration testing and staff awareness training.',
      description:
        'Layered defence for modern threats: next-gen firewalls, endpoint detection, email filtering, vulnerability management and staff training — reported in one clear dashboard.',
      features: ['Next-gen firewall & EDR', 'Email & web filtering', 'Penetration testing', 'POPIA-aware controls'],
      heroImage: {
        src: '/img/service-cybersecurity.webp',
        fallback: '/img/service-cybersecurity.jpg',
        w: 2560,
        h: 1440,
        alt: 'Cybersecurity — firewalls, endpoint protection, penetration testing and staff awareness',
      },
    },
    {
      slug: 'cloud-services',
      title: 'Cloud Services',
      short: 'Microsoft 365, Google Workspace, AWS and Azure — migration, hosting and cost control.',
      description:
        'We plan, migrate and manage Microsoft 365, Google Workspace, AWS and Azure so your team stays productive while cloud spend stays under control.',
      features: ['Migration with zero drama', 'Identity & access setup', 'Backup & retention', 'Cost optimisation'],
      heroImage: {
        src: '/img/service-cloud.webp',
        fallback: '/img/service-cloud.jpg',
        w: 2560,
        h: 1440,
        alt: 'Cloud Services — Microsoft 365, Google Workspace, AWS and Azure',
      },
    },
    {
      slug: 'network-design-setup',
      title: 'Network Design & Setup',
      short: 'Structured cabling, Wi-Fi, VPNs and SD-WAN for offices of any size.',
      description:
        'From a single office to multi-site SD-WAN: structured cabling, enterprise Wi-Fi, secure VPNs and monitoring that keeps every site connected.',
      features: ['Site surveys & design', 'Wi-Fi & switching', 'VPN / SD-WAN', 'Documentation & handover'],
      heroImage: {
        src: '/img/service-network.webp',
        fallback: '/img/service-network.jpg',
        w: 2560,
        h: 1440,
        alt: 'Network Design & Setup — cabling, Wi-Fi, VPN and SD-WAN',
      },
    },
    {
      slug: 'backup-disaster-recovery',
      title: 'Backup & Disaster Recovery',
      short: 'Automated offsite backups and tested recovery plans that restore you fast.',
      description:
        'Automated offsite backups with tested recovery plans. We prove restore times before you need them — not after an outage.',
      features: ['3-2-1 backup strategy', 'Immutable / offsite copies', 'Documented runbooks', 'Quarterly restore tests'],
      heroImage: {
        src: '/img/service-backup.webp',
        fallback: '/img/service-backup.jpg',
        w: 2560,
        h: 1440,
        alt: 'Backup & Disaster Recovery — offsite backups and tested recovery plans',
      },
    },
    {
      slug: 'software-development',
      title: 'Software Development',
      short: 'Custom web, mobile and business applications built to your workflow.',
      description:
        'Custom web, mobile and internal tools built around how your team actually works — with clean code, clear ownership and support after go-live.',
      features: ['Discovery & UX', 'Web & API development', 'Integrations', 'Ongoing maintenance'],
      heroImage: {
        src: '/img/service-software.webp',
        fallback: '/img/service-software.jpg',
        w: 2560,
        h: 1440,
        alt: 'Software Development — custom web, mobile and business applications',
      },
    },
    {
      slug: 'website-design-hosting',
      title: 'Website Design & Hosting',
      short: 'Fast, secure, mobile-first websites and e-commerce stores.',
      description:
        'Fast, secure, mobile-first websites and stores — designed for conversion, hosted on hardened infrastructure with SSL and monitoring included.',
      features: ['Conversion-led design', 'Performance & SEO basics', 'Secure hosting', 'Content updates'],
      heroImage: {
        src: '/img/service-website.webp',
        fallback: '/img/service-website.jpg',
        w: 2560,
        h: 1440,
        alt: 'Website Design & Hosting — fast, secure, mobile-first sites',
      },
    },
    {
      slug: 'it-consulting-strategy',
      title: 'IT Consulting & Strategy',
      short: 'Roadmaps, audits, budgeting and compliance (POPIA, ISO 27001).',
      description:
        'Independent roadmaps, audits and budgets so technology decisions support the business — including POPIA and ISO 27001 readiness.',
      features: ['Infrastructure audits', '3-year roadmaps', 'Budget planning', 'Compliance guidance'],
      heroImage: {
        src: '/img/service-consulting.webp',
        fallback: '/img/service-consulting.jpg',
        w: 2560,
        h: 1440,
        alt: 'IT Consulting & Strategy — roadmaps, audits, budgeting and compliance',
      },
    },
    {
      slug: 'project-management',
      title: 'Project Management',
      short:
        'End-to-end IT and business project delivery — scoped, scheduled, risk-managed and reported until go-live.',
      description:
        'Refine ICT runs technology and business projects from kick-off to handover so your team stays focused on the work, not the chaos. We define scope and success criteria, build realistic timelines and budgets, coordinate vendors and internal stakeholders, track risks and issues, and report progress in plain language. Whether you are migrating to the cloud, rolling out new hardware, implementing cybersecurity controls, launching a software build, or standing up a multi-site network, we apply practical project controls — initiation, planning, execution, monitoring and close-out — with clear RACI, change control and acceptance criteria. You get a named project lead, documented milestones, and a calm delivery path that protects deadlines, cost and quality.',
      features: [
        'Project charter, scope & success criteria',
        'Schedules, budgets & resource planning',
        'Risk, issue & change control',
        'Vendor & stakeholder coordination',
        'Status reporting & steering packs',
        'Go-live readiness & formal handover',
      ],
      heroImage: {
        src: '/img/service-project-management.webp',
        fallback: '/img/service-project-management.jpg',
        w: 2560,
        h: 1440,
        alt: 'Project Management — scoped delivery, schedules, risk control and go-live handover',
      },
    },
    {
      slug: 'hardware-procurement',
      title: 'Hardware & Procurement',
      short: 'Laptops, servers and peripherals supplied, configured and warrantied.',
      description:
        'Business-grade laptops, servers and peripherals — sourced, imaged, warrantied and delivered ready for your users.',
      features: ['Vendor-neutral advice', 'Imaging & enrolment', 'Warranty handling', 'Lifecycle refresh plans'],
      heroImage: {
        src: '/img/service-hardware.webp',
        fallback: '/img/service-hardware.jpg',
        w: 2560,
        h: 1440,
        alt: 'Hardware & Procurement — laptops, servers and peripherals configured and warrantied',
      },
    },
    {
      slug: 'voip-communications',
      title: 'VoIP & Communications',
      short: 'Cloud phone systems, video conferencing and unified messaging.',
      description:
        'Cloud phone systems, video and messaging that work from the office or home — with number porting, call queues and clear billing.',
      features: ['Cloud PBX & softphones', 'Number porting', 'Teams / Meet integration', 'Call analytics'],
      heroImage: {
        src: '/img/service-voip.webp',
        fallback: '/img/service-voip.jpg',
        w: 2560,
        h: 1440,
        alt: 'VoIP & Communications — cloud phone systems, video and unified messaging',
      },
    },
    {
      slug: 'data-analytics-ai',
      title: 'Data Analytics & AI',
      short: 'Dashboards, automation and AI tools that turn your data into decisions.',
      description:
        'Dashboards, automations and practical AI tools that surface the numbers your managers need — without a data-science project that never ships.',
      features: ['KPI dashboards', 'Data pipelines', 'Process automation', 'Responsible AI pilots'],
      heroImage: {
        src: '/img/service-analytics.webp',
        fallback: '/img/service-analytics.jpg',
        w: 2560,
        h: 1440,
        alt: 'Data Analytics & AI — dashboards, automation and decision insights',
      },
    },
    {
      slug: 'on-site-remote-support',
      title: 'On-site & Remote Support',
      short: 'Engineers on call, on site or remote, whenever something breaks.',
      description:
        'Engineers on call — remote first, on site when it matters. Clear tickets, status updates and escalation paths your staff can trust.',
      features: ['Priority SLAs', 'Remote tools', 'Same-day on-site options', 'Named engineer'],
      heroImage: {
        src: '/img/service-support.webp',
        fallback: '/img/service-support.jpg',
        w: 2560,
        h: 1440,
        alt: 'On-site & Remote Support — engineers on call whenever something breaks',
      },
    },
  ],
  process: [
    { title: 'Assess', text: 'We assess your current environment and develop URS.' },
    { title: 'Plan', text: 'We develop project plans with clear deliverables, timelines and aligned pricing.' },
    { title: 'Deliver', text: 'We deliver, while transferring skills to your team.' },
    {
      title: 'Support',
      text: 'Upon completion of the project, we will provide 30 days of complimentary support and maintenance to ensure the stability of the environment and facilitate a smooth transition to normal operations.',
    },
  ],
  testimonials: [],
  about: {
    title: 'About Us',
    lead: '',
    leaderTitle: 'Mattheo Moloele: Managing Director',
    leaderBio:
      'Mattheo is the Managing Director of Refine ICT (Pty) Ltd. He holds a BTech Degree in Financial Accounting, an MBA in Financial Management and Strategy, and an LLB. He brings extensive experience in both finance and information technology (IT), combining strong financial management expertise with technical knowledge and strategic leadership. His multidisciplinary background enables him to provide effective leadership, drive business growth, strengthen financial governance, and oversee the delivery of innovative ICT solutions that meet clients’ business needs.',
    ceo: {
      sectionTitle: 'Meet the CEO',
      name: 'Mattheo Moloele',
      role: 'Chief Executive Officer',
      initials: 'MM',
      photo: '', // add path e.g. '/img/ceo.jpg' when ready
      photoAlt: 'Mattheo Moloele, Chief Executive Officer of Refine ICT',
      message:
        'Technology should never be a barrier to growth — it should be the engine behind it. At Refine ICT, we build partnerships rooted in trust, clarity and measurable outcomes. My commitment is simple: every client receives the same care, urgency and excellence I would demand for my own business. Together, we advance the frontiers of global connectivity — one resilient system, one confident team, one breakthrough at a time.',
    },
    points: [
      'Deliver Excellence: high-performance IT infrastructure and software tailored to strategic goals',
      'Empower Innovation: cloud, networking and modern platforms that create competitive edge',
      'Ensure Reliability & Security: cybersecurity, integration and proactive managed services',
      'Build Lasting Partnerships: transparent communication, agile delivery and dedicated support',
    ],
    securityTitle: 'Security that works while you sleep',
    securityLead:
      'Layered protection: next-gen firewalls, endpoint detection, email filtering, vulnerability scans and quarterly penetration tests, all reported in one dashboard.',
    securityCta: 'Book a security review',
    story:
      'Refine ICT is a full-service ICT partner specialising in cloud solutions, network infrastructure, IT consulting, software engineering and managed services. We bridge complex technology challenges and seamless business operations so organisations can operate efficiently, securely and without boundaries.',
  },
  industries: [
    { title: 'Professional services', text: 'Law, accounting and consulting firms that need secure collaboration and audit-ready records.' },
    { title: 'Healthcare & clinics', text: 'Practices that depend on uptime, privacy and reliable backup of patient systems.' },
    { title: 'Manufacturing & logistics', text: 'Plants and warehouses where downtime means lost production and delayed deliveries.' },
    { title: 'Retail & hospitality', text: 'POS, Wi-Fi and cloud tools that keep branches serving customers without interruption.' },
    { title: 'Education & NGOs', text: 'Schools and non-profits that need enterprise-grade IT on a careful budget.' },
    { title: 'Property & construction', text: 'Multi-site teams that need VPN, site Wi-Fi and mobile-friendly tools.' },
  ],
  partners: [
    { name: 'Microsoft', id: 'ms' },
    { name: 'AWS', id: 'aws' },
    { name: 'Cisco', id: 'cisco' },
    { name: 'Fortinet', id: 'fortinet' },
    { name: 'Google Cloud', id: 'gcp' },
    { name: 'Veeam', id: 'veeam' },
  ],
  faq: [
    {
      q: 'How quickly do you respond to support tickets?',
      a: 'Business-plan clients get a 15-minute response target during business hours for priority issues. Enterprise includes after-hours coverage with the same target for P1 incidents.',
    },
    {
      q: 'Are you POPIA aware?',
      a: 'Yes. We design access control, backup and incident processes with POPIA in mind and can support your Information Officer with practical controls and documentation.',
    },
  ],
  plans: [
    {
      name: 'Essential',
      price: 'R2,499',
      period: 'per user / month',
      blurb: 'Core helpdesk and monitoring for smaller teams.',
      features: ['Remote helpdesk (business hours)', 'Device monitoring', 'Patch management', 'Email & chat support', 'Monthly report'],
      cta: 'Start with Essential',
      highlighted: false,
    },
    {
      name: 'Business',
      price: 'R3,999',
      period: 'per user / month',
      blurb: 'The plan most growing companies choose.',
      features: ['Everything in Essential', '15-min response target', 'Endpoint security', 'Cloud backup of critical data', 'Quarterly strategy review'],
      cta: 'Choose Business',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored annual agreement',
      blurb: 'Dedicated cover for complex or multi-site estates.',
      features: ['Everything in Business', '24/7 emergency desk', 'Named engineer', 'On-site days included', 'Security & compliance programme'],
      cta: 'Talk to sales',
      highlighted: false,
    },
  ],
  caseStudies: [
    {
      title: 'Zero-drama Microsoft 365 migration',
      client: 'Regional accounting firm',
      industry: 'Professional services',
      summary: '120 mailboxes moved over a weekend with dual-delivery cutover and staff training on Monday morning.',
      result: 'Zero lost mail · 40% fewer password tickets in 60 days',
    },
    {
      title: 'Hardened clinic network',
      client: 'Multi-site medical group',
      industry: 'Healthcare',
      summary: 'Segmented guest Wi-Fi, EDR rollout and immutable backups across three clinics.',
      result: 'Passed insurer security review · RPO under 1 hour',
    },
    {
      title: 'Factory floor connectivity',
      client: 'Gauteng manufacturer',
      industry: 'Manufacturing',
      summary: 'Redesigned plant Wi-Fi and SD-WAN link between warehouse and head office.',
      result: '99.95% link uptime · scanners stayed online through load-shedding with UPS plan',
    },
  ],
  blogIntro: 'Notes on IT, security and getting work done without drama.',
  contactIntro: 'We reply within one business day — usually within the hour.',
  servicesIntro: 'One team for support, security, cloud and software — so nothing falls between suppliers.',
  industriesIntro: 'Practical IT for teams that need systems to work on Monday morning — not slide decks.',
  partnersIntro:
    'The company has an established alliance with a partner that possesses the required certifications, qualifications, and technical expertise to deliver the services.',
  plansIntro: 'Transparent monthly pricing. Scale up when you are ready.',
  casesIntro: 'Outcomes our clients care about: uptime, calm Mondays, fewer tickets.',
  assessmentCta: 'Get a free IT assessment',
  servicesCta: 'See our services',
  viewAllServices: 'View all services',
  callBarLabel: 'Call us now',
  whatsappLabel: 'Chat on WhatsApp',
  ticketIntro: 'Already a client? Open a support ticket and we will send you a reference number.',
  seo: {
    homeTitle: 'Managed IT, Cloud & Cybersecurity',
    homeDescription:
      'Managed IT support, cybersecurity, cloud, networking and software development for growing businesses.',
    servicesTitle: 'IT Services',
    servicesDescription:
      'Managed IT, cybersecurity, cloud, networking, backup, software development and more.',
    aboutTitle: 'About Us',
    aboutDescription:
      'Advancing the frontiers of global connectivity with cloud, network, software, cybersecurity and managed ICT services.',
    contactTitle: 'Contact & Support',
    contactDescription: 'Request a quote or open a support ticket. We reply within one business day.',
  },
};
