type Icon = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

type SocialLink = {
  name: string;
  url: string;
  icon: Icon;
  navbar: boolean;
};

type Contact = {
  email: string;
  tel: string;
  social: {
    GitHub: SocialLink;
    LinkedIn: SocialLink;
    X: SocialLink;
    email: SocialLink;
  };
};

type NavbarItem = {
  href: string;
  icon: Icon;
  label: string;
};

type WorkExperience = {
  company: string;
  title: string;
  start: string;
  end?: string;
  location: string;
  description: string;
  logoUrl: string;
  href: string;
  badges: string[];
};

type Education = {
  school: string;
  degree: string;
  start: string;
  end: string;
  logoUrl: string;
  href: string;
};

type Project = {
  title: string;
  href: string;
  active: boolean;
  description: string;
  dates: string;
  technologies: string[];
  image?: string;
  video?: string;
  links?: {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
};

export type ResumeData = {
  name: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  summary: string;
  avatarUrl: string;
  skills: string[];
  navbar: NavbarItem[];
  contact: Contact;
  work: WorkExperience[];
  education: Education[];
  projects: Project[];
};
