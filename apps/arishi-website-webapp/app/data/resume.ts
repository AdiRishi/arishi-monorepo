import { LinkedinIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import { GithubIcon } from '~/components/icons/GithubIcon';
import { XIcon } from '~/components/icons/XIcon';

export const RESUME_DATA: ResumeData = {
  name: 'Adishwar Rishi',
  initials: 'AR',
  location: 'Greater Sydney Area',
  locationLink: 'https://www.google.com/maps/place/Sydney',
  about: `A senior full stack developer with 7+ years of experience. Currently working as a Technical Lead at Freelancer.com.`,
  summary: `A seasoned Senior Engineer with over 7 years of expertise in comprehensive product development, I am deeply passionate about architecting cost-effective and highly scalable systems. My skills extend from constructing intricate UIs to developing and managing servers on AWS and Cloudflare, with a particular enthusiasm for serverless technology. I have consistently led teams to deliver innovative solutions on schedule and to the highest standards, while actively shaping system architecture and engineering best practices. I am committed to enhancing developer experience, driving me to create systems that are not only robust and efficient, but also intuitive and seamless to use.`,
  avatarUrl:
    'https://public-assets.adishwar-rishi.com/cdn-cgi/image/width=200,quality=75,format=auto/images/cartoon-headshot.png',
  personalWebsiteUrl: 'https://adishwar-rishi.com',
  contact: {
    email: 'adishwar.rishi@gmail.com',
    tel: '+61422359391',
    social: [
      { name: 'GitHub', url: 'https://github.com/AdiRishi', icon: GithubIcon },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/adishwar-rishi-8a832498',
        icon: LinkedinIcon as unknown as FunctionComponent<React.SVGProps<SVGSVGElement>>,
      },
      { name: 'X (Formerly known as Twitter)', url: 'https://twitter.com/AdishwarR', icon: XIcon },
    ],
  },
  education: [
    {
      school: 'UNSW',
      degree: 'Bachelor of Engineering (B.E.) Computer Software Engineering',
      start: '2014',
      end: '2017',
    },
    {
      school: 'Cherrybrook Technology High School',
      degree: 'High School Certificate (HSC)',
      start: '2010',
      end: '2013',
    },
  ],
  work: [
    {
      company: 'Airwallex',
      link: 'https://www.airwallex.com',
      badges: ['Promotion'],
      title: 'Senior Software Engineer',
      start: 'June 2024',
      end: 'Present',
      description:
        'Senior software engineer at Airwallex, working in the Cards and spend management team.',
    },
    {
      company: 'Freelancer.com',
      link: 'https://www.freelancer.com',
      badges: ['Promotion'],
      title: 'Senior Software Engineer - Technical Lead',
      start: 'Sep 2019',
      end: 'June 2024',
      description:
        'Tech Lead for Escrow.com, steering technical direction and ensuring quality and timely delivery. Managed a tech stack with 20+ Python services, databases, and React.js front-end. Architected new features, maintained system integrity, and managed AWS infrastructure to achieve a 99.9% uptime SLA.',
    },
    {
      company: 'Freelancer.com',
      link: 'https://www.freelancer.com',
      badges: ['Promotion'],
      title: 'Engineering Team Lead',
      start: 'Feb 2019',
      end: 'Sep 2019',
      description:
        "Guided a cross-regional team of 10 engineers, ensuring alignment with the Product Manager's vision and maintaining high-quality standards. Mentored junior staff, leading to significant pay raises for three team members, and served as the primary on-call for critical production issues.",
    },
    {
      company: 'Freelancer.com',
      link: 'https://www.freelancer.com',
      badges: ['Full time'],
      title: 'Software Engineer',
      start: 'Nov 2017',
      end: 'Feb 2019',
      description:
        'Led the full-stack redevelopment of the internal escalation system, incorporating complex SQL queries, backend logic, and front-end interfaces, which significantly improved response efficiency and team productivity. Engineered, tested, and maintained robust software systems, and facilitated cross-team collaboration to align technical solutions with business objectives.',
    },
    {
      company: 'Freelancer.com',
      link: 'https://www.freelancer.com',
      badges: ['Internship'],
      title: 'Software Engineering Intern',
      start: 'Nov 2016',
      end: 'Nov 2017',
      description:
        'Participated in software development lifecycle, engaged with various teams to enhance platform capabilities, and assisted in technical documentation and system maintenance.',
    },
  ],
  skills: ['JS/TS', 'Python/Node/Golang/Rust', 'React/Vue', 'GraphQL', 'AWS', 'Docker', 'Serverless'],
  projects: [
    {
      title: 'Turborepo Remote Cache',
      techStack: ['OSS'],
      description: 'An implementation of the turborepo-remote-cache server custom made for Cloudflare Workers',
      link: {
        href: 'https://github.com/AdiRishi/turborepo-remote-cache-cloudflare',
      },
    },
    {
      title: 'Cacified adapter for Cloudflare KV',
      techStack: ['OSS'],
      description: 'The official Cloudflare KV adapter for @epic-web/cachified',
      link: {
        href: 'https://www.npmjs.com/package/cachified-adapter-cloudflare-kv',
      },
    },
  ],
} as const;

// =========== Types =========== //

type SocialLink = {
  name: string;
  url: string;
  icon: FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
};

type WorkExperience = {
  company: string;
  link: string;
  badges: string[];
  title: string;
  start: string;
  end: string;
  description: string;
};

type Project = {
  title: string;
  techStack: string[];
  description: string;
  link?: {
    href: string;
  };
};

type ResumeData = {
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  avatarUrl: string;
  personalWebsiteUrl: string;
  contact: {
    email: string;
    tel: string;
    social: SocialLink[];
  };
  education: Education[];
  work: WorkExperience[];
  skills: string[];
  projects: Project[];
};
