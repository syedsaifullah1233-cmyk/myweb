export interface Project {
  id: string;
  title: string;
  description: string;
  details: string; // Detailed markdown/text for portfolio popups
  category: string;
  image: string;
  thumbnail: string;
  liveUrl?: string; // If set, this is a Live Project
  isLive: boolean; // Flag to show in the "Live Projects" section
  featured: boolean;
  hidden: boolean;
  createdAt?: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImage: string;
}

export interface AboutContent {
  headline: string;
  story: string;
  metrics: { label: string; value: string }[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon identifier
  features: string[];
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  feedback: string;
  avatar: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  email: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutContent;
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  faq: FaqItem[];
  social: SocialLinks;
  contact: ContactInfo;
}

export interface DatabaseSchema {
  projects: Project[];
  content: WebsiteContent;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  description: string;
  message: string;
}
