import { LinkedinIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import { GithubIcon } from '~/components/icons/GithubIcon';
import { XIcon } from '~/components/icons/XIcon';

export const RESUME_DATA: ResumeData = {
  name: 'Adishwar Rishi',
  initials: 'AR',
  location: 'Greater Sydney Area',
  locationLink: 'https://www.google.com/maps/place/Sydney',
  about:
    'A senior full stack developer with 7+ years of experience. Currently working as an Engineering Manager at Freelancer.com.',
  summary:
    'Experienced engineer focused on full stack development with knowledge in devops/syseng. Engages in activities like kickboxing, game development, and playing TTRPG games.',
  avatarUrl: 'https://public-assets.adishwar-rishi.com/images/cartoon-headshot.png',
  personalWebsiteUrl: 'https://adishwar-rishi.com',
  contact: {
    email: 'adiswa123@gmail.com',
    tel: '+61422359391',
    social: [
      { name: 'GitHub', url: 'https://github.com/AdiRishi', icon: GithubIcon },
      {
        name: 'LinkedIn',
        url: 'www.linkedin.com/in/adishwar-rishi-8a832498',
        icon: LinkedinIcon as unknown as FunctionComponent<React.SVGProps<SVGSVGElement>>,
      },
      { name: 'X', url: 'https://twitter.com/AdishwarR', icon: XIcon },
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
      company: 'Freelancer.com',
      link: 'https://www.freelancer.com',
      badges: ['Full Time', 'Promotion'],
      title: 'Engineering Manager',
      start: 'Sep 2019',
      end: 'Present',
      description:
        'Responsible for the output and quality of product teams, providing technical and managerial coaching, overseeing technical architecture, and ensuring alignment with the Engineering Roadmap. Manage and develop engineering teams and leads, fostering a culture of feedback and continuous improvement.',
    },
    {
      company: 'Freelancer.com',
      link: 'https://www.freelancer.com',
      badges: ['Full time', 'Promotion'],
      title: 'Engineering Team Lead',
      start: 'Feb 2019',
      end: 'Sep 2019',
      description:
        'Ensured team execution aligned with PM vision, made technical decisions in line with platform and Engineering Roadmap, managed product technical health, and provided coaching and feedback to engineers and QAs.',
    },
    {
      company: 'Freelancer.com',
      link: 'https://www.freelancer.com',
      badges: ['Full time', 'Promotion'],
      title: 'Software Engineer',
      start: 'Nov 2017',
      end: 'Feb 2019',
      description:
        'Involved in the Escrow.com team, focusing on software design, system analysis, and improvement of platform usability and performance, while maintaining and documenting software systems.',
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
  skills: ['JS/TS', 'Python/Node/Golang/Rust', 'React/Vue', 'GraphQL', 'AWS', 'Docker'],
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
