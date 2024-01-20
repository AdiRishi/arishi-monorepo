import { FunctionComponent } from 'react';
import { GithubIcon } from '~/components/icons/GithubIcon';

export const RESUME_DATA: ResumeData = {
  name: 'Bartosz Jarocki',
  initials: 'BJ',
  location: 'Wrocław, Poland, CET',
  locationLink: 'https://www.google.com/maps/place/Wrocław',
  about: 'Full Stack Engineer focused on building products with extra attention to detail',
  summary:
    'As a Full Stack Engineer, I have successfully taken multiple products from 0 to 1. I lead teams effectively, ensuring an environment where people can do their best work. Currently, I work mostly with TypeScript, React, Node.js, and GraphQL. I have over 8 years of experience in working remotely with companies all around the world.',
  avatarUrl: 'https://avatars.githubusercontent.com/u/1017620?v=4',
  personalWebsiteUrl: 'https://jarocki.me',
  contact: {
    email: 'bartosz.jarocki@hey.com',
    tel: '+48530213401',
    social: [
      { name: 'GitHub', url: 'https://github.com/BartoszJarocki', icon: GithubIcon },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/in/bjarocki/', icon: GithubIcon },
      { name: 'X', url: 'https://x.com/BartoszJarocki', icon: GithubIcon },
    ],
  },
  education: [
    {
      school: 'Wrocław University of Technology',
      degree: "Bachelor's Degree in Control systems engineering and Robotics",
      start: '2007',
      end: '2010',
    },
  ],
  work: [
    {
      company: 'Parabol',
      link: 'https://parabol.co',
      badges: ['Remote'],
      title: 'Senior Full Stack Developer',
      logo: GithubIcon,
      start: '2021',
      end: '2024',
      description:
        'Implemented new features, led squad, worked on improving the way developers ship the code, started migration from Emotion to Tailwind CSS and more. Technologies: React, TypeScript, GraphQL',
    },
    {
      company: 'Clevertech',
      link: 'https://clevertech.biz',
      badges: ['Remote'],
      title: 'Lead Android Developer → Full Stack Developer',
      logo: GithubIcon,
      start: '2015',
      end: '2021',
      description:
        'Created Android mobile apps and led teams for companies like Vision Media, DKMS, or AAA. Built live streaming application for Evercast from scratch. Technologies: Android, Kotlin, React, TypeScript, GraphQL',
    },
    {
      company: 'Jojo Mobile',
      link: 'https://bsgroup.eu/',
      badges: [],
      title: 'Android Developer → Lead Android Developer',
      logo: GithubIcon,
      start: '2012',
      end: '2015',
      description:
        'Built an Android team, created Android apps for biggest Polish companies like LOT, Polskie Radio, Agora, PolskaPress',
    },
    {
      company: 'Nokia Siemens Networks',
      link: 'https://www.nokia.com',
      badges: [],
      title: 'C/C++ Developer',
      logo: GithubIcon,
      start: '2010',
      end: '2012',
      description: 'Creating and testing software for LTE base stations',
    },
  ],
  skills: ['JavaScript', 'TypeScript', 'React/Next.js/Remix', 'Node.js', 'GraphQL', 'Relay', 'WebRTC'],
  projects: [
    {
      title: 'Consultly',
      techStack: ['Side Project', 'TypeScript', 'Next.js', 'Vite', 'GraphQL', 'WebRTC'],
      description: 'A platform to build and grow your online business',
      logo: GithubIcon,
      link: {
        label: 'consultly.com',
        href: 'https://consultly.com/',
      },
    },
    {
      title: 'Monito',
      techStack: ['Side Project', 'TypeScript', 'Next.js', 'Browser Extension'],
      description: 'Browser extension that records everything happening in a web application',
      logo: GithubIcon,
      link: {
        label: 'monito.dev',
        href: 'https://monito.dev/',
      },
    },
    {
      title: 'Jarocki.me',
      techStack: ['Side Project', 'Next.js', 'MDX'],
      description: 'My personal website and blog. Built with Next.js and Notion API',
      logo: GithubIcon,
      link: {
        label: 'github.com',
        href: 'https://jarocki.me/',
      },
    },
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
    {
      title: 'Barepapers',
      techStack: ['Side Project', 'Next.js', 'Puppeteer'],
      description: 'Generates beautiful wallpapers using random shapes and gradients',
      logo: GithubIcon,
      link: {
        label: 'barepapers.com',
        href: 'https://barepapers.com/',
      },
    },
    {
      title: 'Year progress',
      techStack: ['Side Project', 'TypeScript', 'Next.js'],
      description: 'Tracks current year progress and displays a countdown',
      logo: GithubIcon,
      link: {
        label: 'getyearprogress.com',
        href: 'https://getyearprogress.com/',
      },
    },
    {
      title: 'Parabol',
      techStack: ['Full Stack Developer', 'TypeScript', 'React', 'Node.js', 'GraphQL'],
      description: 'The Agile meeting co-pilot that delivers better meetings with less effort',
      logo: GithubIcon,
      link: {
        label: 'github.com',
        href: 'https://parabol.co/',
      },
    },
    {
      title: 'Evercast',
      techStack: ['Lead Frontend Developer', 'TypeScript', 'React', 'Node.js', 'GraphQL'],
      description: 'Creative collaboration platform that combines video conferencing and HD media streaming',
      logo: GithubIcon,
      link: {
        label: 'evercast.us',
        href: 'https://www.evercast.us/',
      },
    },
    {
      title: 'Mobile Vikings',
      techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
      description: 'Android application for leading virtual mobile operator in Poland',
      logo: GithubIcon,
      link: {
        label: 'mobilevikings.pl',
        href: 'https://mobilevikings.pl/',
      },
    },
    {
      title: 'Howdy',
      techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
      description: 'Howdy is a place for you to join communities you care about',
      logo: GithubIcon,
      link: {
        label: 'play.google.com',
        href: 'https://howdy.co/',
      },
    },
    {
      title: 'Tastycloud',
      techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
      description: 'Android application for managing and displaying restaurant menus in kiosk mode',
      logo: GithubIcon,
      link: {
        label: 'tastycloud.fr',
        href: 'https://www.tastycloud.fr/',
      },
    },
    {
      title: 'Ambit',
      techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
      description: 'Android application that helps with sharing your contact details',
      logo: GithubIcon,
      link: {
        label: 'tastycloud.fr',
        href: 'https://www.tastycloud.fr/',
      },
    },
    {
      title: 'Bim',
      techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
      description: 'Android application that helps with booking a table in a restaurants',
      logo: GithubIcon,
      link: {
        label: 'tastycloud.fr',
        href: 'https://www.tastycloud.fr/',
      },
    },
    {
      title: 'Canal Digital GO',
      techStack: ['Lead Android Developer', 'Android', 'Kotlin'],
      description: 'Video streaming mobile application for Canal Digital subscribers',
      logo: GithubIcon,
      link: {
        label: 'tastycloud.fr',
        href: 'https://www.tastycloud.fr/',
      },
    },
  ],
} as const;

// =========== Types =========== //

type SocialLink = {
  name: string;
  url: string;
  icon: FunctionComponent;
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
