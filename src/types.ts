export interface AllocationItem {
  assetClass: string;
  percentage: number;
  rationale: string;
}

export interface StrategicPillar {
  title: string;
  description: string;
  steps: string[];
}

export interface RegionalTactic {
  name: string;
  detail: string;
}

export interface TimelinePhase {
  phase: string;
  duration: string;
  actions: string[];
}

export interface AdviceReport {
  clientGreeting: string;
  assetAllocation: AllocationItem[];
  strategicPillars: StrategicPillar[];
  regionalTactics: RegionalTactic[];
  timelinePhases: TimelinePhase[];
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "advisor";
  text: string;
  timestamp: string;
}

export interface Consultant {
  id: string;
  name: string;
  title: string;
  rating: number;
  experience: string;
  specialty: string;
  avatarUrl: string;
  bio: string;
  availableSlots: string[];
}
