// EDIT THIS FILE to change company details, numbers, logo and images. No other file needs touching.
window.SITE = {
  name: 'Refine ICT',
  legalName: 'RefineICT Pty (Ltd).', // header & footer only
  tagline: 'Technology that keeps your business running.',
  logo: '/img/logo.png',
  logoDark: '/img/logo.png', // same lockup works on light & dark (navy plate + white type)
  email: 'mattheomt@refineict.com',
  phone: '082 978 7832',
  whatsapp: '+27829787832',
  address: '154 Amethyst Drive, Pebble Rock Golf Estate, Roodeplaat, Pretoria, 0039, Gauteng, South Africa',
  hours: 'Mon–Fri 08:00–17:00 · Emergency support 24/7',
  map: {
    lat: -25.6088,
    lng: 28.3865,
    zoom: 15,
    label: 'Refine ICT — 154 Amethyst Drive, Pebble Rock Golf Estate',
  },
  url: 'https://refineict.co.za',
  heroLead:
    "Fixed-price IT support, cloud, security and software for businesses that can't afford downtime.",
  statusLine: 'All client systems operational',
  stats: [
    { value: 12, suffix: '+', label: 'Years in business' },
    { value: 350, suffix: '+', label: 'Clients supported' },
    { value: 99.9, suffix: '%', label: 'Uptime delivered' },
    { value: 15, suffix: ' min', label: 'Average response time' },
  ],
  images: {
    heroBg: {
      src: 'img/hero-bg.webp',
      fallback: 'img/hero-bg.jpg',
      w: 1920,
      h: 1080,
      alt: 'Refine ICT — advancing the frontiers of global connectivity',
    },
    hero: { src: 'img/hero.webp', w: 1400, h: 1050, alt: 'Server infrastructure managed by our engineers' },
    about: {
      src: 'img/about.webp',
      fallback: 'img/about.png',
      w: 1600,
      h: 873,
      alt: 'Engineers who treat your systems as their own — Refine ICT team at work',
    },
    security: {
      src: 'img/security.webp',
      fallback: 'img/security.jpg',
      w: 1600,
      h: 873,
      alt: 'Security that works while you sleep — 24/7 home and business protection',
    },
    network: { src: 'img/network.webp', w: 1200, h: 960, alt: 'Global network connectivity' },
    contactBg: {
      src: 'img/contact-bg.webp',
      fallback: 'img/contact-bg.jpg',
      w: 1024,
      h: 559,
      alt: 'Refine ICT — advancing the frontiers of global connectivity',
    },
    faq: {
      src: 'img/faq.webp',
      fallback: 'img/faq.png',
      w: 1024,
      h: 559,
      alt: 'FAQ: We have answers — general information, support and services',
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
        alt: 'IT Consulting & Strategy — roadmaps, audits, budgeting and compliance',
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
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
        w: 1920,
        h: 1080,
        alt: 'On-site & Remote Support — engineers on call whenever something breaks',
      },
    },
  ],
  process: [
    { title: 'Assess', text: 'We audit your systems, risks and goals.' },
    { title: 'Plan', text: 'You get a clear scope, timeline and fixed pricing.' },
    { title: 'Deliver', text: 'We implement with minimal disruption to your team.' },
    { title: 'Support', text: 'We monitor, maintain and improve — continuously.' },
  ],
  testimonials: [
    {
      quote: 'Our downtime dropped to almost zero within a quarter. They answer faster than any provider we have used.',
      author: 'Mampotje M., Operations Director',
    },
    {
      quote: 'The cloud migration was finished over a weekend. On Monday nobody noticed — which is exactly what we wanted.',
      author: 'Mattheo M., CEO',
    },
  ],
  about: {
    title: 'Engineers who treat your systems as their own',
    lead: 'We are a team of certified engineers, developers and security specialists. We explain things in plain language, price everything upfront and answer the phone.',
    points: [
      'Certified Microsoft, AWS, Cisco and Fortinet specialists',
      '24/7 monitoring with a 15-minute response target',
      'POPIA-aware security and compliance built in',
      'No lock-in contracts — month-to-month available',
    ],
    securityTitle: 'Security that works while you sleep',
    securityLead:
      'Layered protection: next-gen firewalls, endpoint detection, email filtering, vulnerability scans and quarterly penetration tests, all reported in one dashboard.',
    securityCta: 'Book a security review',
    story:
      'Founded in Pretoria, Refine ICT grew from a two-engineer support desk into a full-stack technology partner for SMEs and mid-market teams across Gauteng and beyond. We still answer the phone ourselves.',
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
      q: 'Do you lock us into long contracts?',
      a: 'No. Month-to-month is available. Most clients choose 12-month agreements for a better rate, but you can leave with 30 days’ notice after the initial term.',
    },
    {
      q: 'Can you work with our existing vendors?',
      a: 'Yes. We often become the single throat to choke — coordinating ISPs, software vendors and hardware warranties so your team has one place to call.',
    },
    {
      q: 'Are you POPIA aware?',
      a: 'Yes. We design access control, backup and incident processes with POPIA in mind and can support your Information Officer with practical controls and documentation.',
    },
    {
      q: 'Do you only work in Pretoria?',
      a: 'Our base is Pretoria / Gauteng. We support remote clients nationally and arrange on-site engineers for other metros when needed.',
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
  partnersIntro: 'Technology alliances our engineers work with every day.',
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
      'Certified engineers delivering managed IT, cloud and cybersecurity without the jargon.',
    contactTitle: 'Contact & Support',
    contactDescription: 'Request a quote or open a support ticket. We reply within one business day.',
  },
};
