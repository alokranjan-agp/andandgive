export enum Industry {
  TECHNOLOGY = 'Technology & IT',
  MARKETING = 'Marketing & Design',
  LEGAL = 'Legal & Accounting',
  REAL_ESTATE = 'Real Estate & Construction',
  HEALTH = 'Health & Wellness',
  FINANCE = 'Finance & Insurance',
  EVENTS = 'Events & Hospitality',
  TRADES = 'Trades & Services',
  GENERAL = 'General / Unclassified'
}

export interface Member {
  id: string;
  name: string;
  company: string;
  industry: Industry;
  specialty: string;
  asks: string[];
  gives: string[];
  avatar: string;
  email: string;
  phoneNumber: string;
  chapterRole?: string;
}

export interface MatchResult {
  memberId: string;
  score: number;
  reason: string;
  matchedItem: string; // The specific Ask or Give that triggered the match
}

export type MatchType = 'ASK_TO_GIVE' | 'GIVE_TO_ASK';
