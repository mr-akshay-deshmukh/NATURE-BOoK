export interface Volunteer {
  id: string;
  name: string;
  email: string;
  role: 'trees' | 'cleanup' | 'stopping_degradation' | 'donation' | 'education';
  contributionAmount?: number;
  solutionWork: string;
}

export interface AIResolutionGuide {
  summary: string;
  immediateSteps: string[];
  longTermSolutions: string[];
  neededResources: string[];
  safetyPrecautions: string[];
}

export interface PollutionReport {
  id: string;
  title: string;
  description: string;
  category: 'deforestation' | 'water_pollution' | 'waste_dump' | 'air_pollution' | 'soil_erosion';
  status: 'reported' | 'analyzing' | 'implementing' | 'resolved';
  latitude: number;
  longitude: number;
  address: string;
  fileUrl?: string; // photo/audio/video base64 or illustrative URL
  fileType?: 'image' | 'audio' | 'video' | 'none';
  reportedAt: string;
  volunteers: Volunteer[];
  aiResolutionGuide?: AIResolutionGuide;
}

export interface LearnResolveItem {
  id: string;
  issue: string;
  category: string;
  description: string;
  solutionTitle: string;
  solutionDetails: string;
  benefits: string[];
  isCustom?: boolean;
}

export interface BusinessEnvironmentItem {
  id: string;
  wasteMaterial: string;
  businessName: string;
  productDescription: string;
  targetMarket: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  environmentalImpact: string;
  revenueModel: string;
}

export interface HistoricalDisaster {
  id: string;
  title: string;
  year: number;
  location: string;
  description: string;
  consequences: string;
  solutionsTaken: string[];
  modernLessons: string;
}

export interface FutureEnvironmentalThreat {
  id: string;
  year: number;
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  riskDescription: string;
  severity: 'Moderate' | 'Severe' | 'Critical';
  requiredSolutionType: string;
  userSolutions?: {
    id: string;
    userName: string;
    proposedSolution: string;
    viabilityScore: number;
    aiFeedback: string;
  }[];
}
