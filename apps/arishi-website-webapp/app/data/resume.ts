import { LinkedinIcon, type LucideIcon } from 'lucide-react';
import { FunctionComponent } from 'react';
import { GithubIcon } from '~/components/icons/GithubIcon';
import { XIcon } from '~/components/icons/XIcon';

export const RESUME_DATA: ResumeData = {
  name: 'Adishwar Rishi',
  initials: 'AR',
  location: 'Greater Sydney Area',
  locationLink: 'https://www.google.com/maps/place/Sydney',
  about:
    'Graduated from UNSW Software Engineering in 2018. Currently working as an Engineering Manager at Freelancer.com.',
  summary:
    'Experienced engineer focused on full stack development with knowledge in devops/syseng. Engages in activities like kickboxing, game development, and playing TTRPG games.',
  avatarUrl: 'https://public-assets.adishwar-rishi.com/images/cartoon-headshot.png',
  personalWebsiteUrl: 'www.linkedin.com/in/adishwar-rishi-8a832498',
  contact: {
    email: 'adiswa123@gmail.com',
    tel: '+61422359391',
    social: [
      { name: 'LinkedIn', url: 'www.linkedin.com/in/adishwar-rishi-8a832498', icon: LinkedinIcon },
      { name: 'GitHub', url: 'github.com/AdiRishi', icon: GithubIcon as unknown as LucideIcon },
      { name: 'Twitter', url: 'twitter.com/AdiRishi_', icon: XIcon as unknown as LucideIcon },
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
      link: 'www.freelancer.com',
      badges: ['Engineering Manager', 'Team Lead', 'Software Engineer'],
      title: 'Engineering Manager',
      logo: GithubIcon,
      start: 'September 2019',
      end: 'Present',
      description:
        'Responsible for the output of product teams, coaching, overseeing technical architecture, and balancing stakeholder needs.',
    },
  ],
  skills: ['Software Infrastructure', 'Java', 'C++'],
  projects: [
    {
      title: 'Minimal',
      techStack: ['Side Project', 'Next.js', 'Puppeteer'],
      description: 'Minimalist calendars, habit trackers and planners generator',
      logo: GithubIcon,
      link: {
        label: 'useminimal.com',
        href: 'https://useminimal.com/',
      },
    },
  ],
};

// =========== Types =========== //

type SocialLink = {
  name: string;
  url: string;
  icon: LucideIcon;
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
  logo: FunctionComponent;
  start: string;
  end: string;
  description: string;
};

type Project = {
  title: string;
  techStack: string[];
  description: string;
  logo: FunctionComponent;
  link: {
    label: string;
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
