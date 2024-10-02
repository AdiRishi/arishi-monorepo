import { HomeIcon } from 'lucide-react';
import { Icons } from '~/components/icons';
import { ResumeData } from './resume-type';

export const DATA: ResumeData = {
  name: 'Adishwar Rishi',
  initials: 'AR',
  url: 'https://adishwar-rishi.com',
  location: 'Greater Sydney Area',
  locationLink: 'https://www.google.com/maps/place/Sydney',
  description: 'A senior full stack developer with 7+ years of experience. Currently working at Airwallex.',
  summary:
    'A seasoned Senior Engineer with over 7 years of expertise in comprehensive product development, I am deeply passionate about architecting cost-effective and highly scalable systems. My skills extend from constructing intricate UIs to developing and managing servers on AWS and Cloudflare, with a particular enthusiasm for serverless technology. I have consistently led teams to deliver innovative solutions on schedule and to the highest standards, while actively shaping system architecture and engineering best practices. I am committed to enhancing developer experience, driving me to create systems that are not only robust and efficient, but also intuitive and seamless to use.',
  avatarUrl: 'https://public-assets.adishwar-rishi.com/images/cartoon-headshot.png',
  skills: ['JS/TS', 'Python/Node/Golang/Rust', 'React/Vue', 'GraphQL', 'AWS', 'Docker', 'Serverless'],
  navbar: [{ href: '/', icon: HomeIcon, label: 'Home' }],
  contact: {
    email: 'adishwar.rishi@gmail.com',
    tel: '+61422359391',
    social: {
      GitHub: {
        name: 'GitHub',
        url: 'https://github.com/AdiRishi',
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/adishwar-rishi-8a832498',
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: 'X',
        url: 'https://twitter.com/AdishwarR',
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: 'Send Email',
        url: '#',
        icon: Icons.email,
        navbar: true,
      },
    },
  },
  work: [
    {
      company: 'Airwallex',
      href: 'https://airwallex.com',
      badges: [],
      location: 'Sydney',
      title: 'Senior Software Engineer',
      logoUrl: 'https://public-assets.adishwar-rishi.com/images/logos/airwallex.png',
      start: 'June 2024',
      end: 'Present',
      description: 'Senior software engineer at Airwallex, working in the Cards and spend management team.',
    },
    {
      company: 'Freelancer.com',
      badges: [],
      href: 'https://www.freelancer.com',
      location: 'Sydney',
      title: 'Senior Software Engineer - Technical Lead',
      logoUrl: 'https://public-assets.adishwar-rishi.com/images/logos/freelancer.png',
      start: 'Sep 2019',
      end: 'June 2024',
      description:
        'Tech Lead for Escrow.com, steering technical direction and ensuring quality and timely delivery. Managed a tech stack with 20+ Python services, databases, and React.js front-end. Architected new features, maintained system integrity, and managed AWS infrastructure to achieve a 99.9% uptime SLA.',
    },
    {
      company: 'Freelancer.com',
      badges: [],
      href: 'https://www.freelancer.com',
      location: 'Sydney',
      title: 'Engineering Team Lead',
      logoUrl: 'https://public-assets.adishwar-rishi.com/images/logos/freelancer.png',
      start: 'Feb 2019',
      end: 'Sep 2019',
      description:
        "Guided a cross-regional team of 10 engineers, ensuring alignment with the Product Manager's vision and maintaining high-quality standards. Mentored junior staff, leading to significant pay raises for three team members, and served as the primary on-call for critical production issues.",
    },
    {
      company: 'Freelancer.com',
      badges: [],
      href: 'https://www.freelancer.com',
      location: 'Sydney',
      title: 'Software Engineer',
      logoUrl: 'https://public-assets.adishwar-rishi.com/images/logos/freelancer.png',
      start: 'Nov 2017',
      end: 'Feb 2019',
      description:
        'Led the full-stack redevelopment of the internal escalation system, incorporating complex SQL queries, backend logic, and front-end interfaces, which significantly improved response efficiency and team productivity. Engineered, tested, and maintained robust software systems, and facilitated cross-team collaboration to align technical solutions with business objectives.',
    },
    {
      company: 'Freelancer.com',
      badges: [],
      href: 'https://www.freelancer.com',
      location: 'Sydney',
      title: 'Software Engineering Intern',
      logoUrl: 'https://public-assets.adishwar-rishi.com/images/logos/freelancer.png',
      start: 'Nov 2016',
      end: 'Nov 2017',
      description:
        'Participated in software development lifecycle, engaged with various teams to enhance platform capabilities, and assisted in technical documentation and system maintenance.',
    },
  ],
  education: [
    {
      school: 'UNSW',
      href: 'https://www.unsw.edu.au',
      degree: 'Bachelor of Engineering (B.E.) Computer Software Engineering',
      logoUrl: 'https://public-assets.adishwar-rishi.com/images/logos/unsw.png',
      start: '2014',
      end: '2017',
    },
    {
      school: 'Cherrybrook Technology High School',
      href: 'https://cths.nsw.edu.au',
      degree: 'High School Certificate (HSC)',
      logoUrl: 'https://public-assets.adishwar-rishi.com/images/logos/cths.png',
      start: '2010',
      end: '2013',
    },
  ],
  projects: [
    {
      title: 'Turborepo Remote Cache',
      href: 'https://adirishi.github.io/turborepo-remote-cache-cloudflare/',
      dates: 'April 2023 - Present',
      active: true,
      description: 'An implementation of the turborepo-remote-cache server custom made for Cloudflare Workers',
      technologies: ['Serverless', 'Cloudflare Workers', 'Turborepo', 'R2', 'KV'],
      links: [
        {
          type: 'Website',
          href: 'https://adirishi.github.io/turborepo-remote-cache-cloudflare/',
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: 'Source',
          href: 'https://github.com/AdiRishi/turborepo-remote-cache-cloudflare',
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
    {
      title: 'Cacified adapter for Cloudflare KV',
      href: 'https://www.npmjs.com/package/cachified-adapter-cloudflare-kv',
      dates: 'April 2023 - Present',
      active: true,
      description: 'The official Cloudflare KV adapter for @epic-web/cachified',
      technologies: ['Serverless', 'Cloudflare Workers', '@epic-web/cachified', 'KV'],
      links: [
        {
          type: 'Website',
          href: 'https://www.npmjs.com/package/cachified-adapter-cloudflare-kv',
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: 'Source',
          href: 'https://github.com/AdiRishi/cachified-adapter-cloudflare-kv',
          icon: <Icons.github className="size-3" />,
        },
      ],
    },
  ],
};
