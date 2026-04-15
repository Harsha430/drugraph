export interface Drug {
  id: string;
  name: string;
  status: 'approved' | 'investigational' | 'withdrawn' | 'experimental';
  categories: string[];
  mechanism: string;
  description: string;
  interactionCount: number;
  targetCount: number;
  targets: string[];
  halfLife?: string;
  bioavailability?: string;
  proteinBinding?: string;
  molecularWeight?: string;
  formula?: string;
  atcCode?: string;
}

export interface SearchRequest {
  query: string;
  k?: number;
}

export interface DrugInteraction {
  drug_a: string;
  drug_b: string;
  severity: 'critical' | 'major' | 'minor';
  description: string;
  mechanism?: string;
  management?: string;
}

export interface SafetyReport {
  drugs: string[];
  interactions: DrugInteraction[];
  riskProfile: RiskProfile;
}

export interface RiskProfile {
  bleedingRisk: number;
  cardiacRisk: number;
  renalRisk: number;
  hepaticRisk: number;
  cnsRisk: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: SourceKnowledge;
}

export interface SourceKnowledge {
  cypherQuery: string;
  vectorSnippets: VectorSnippet[];
}

export interface VectorSnippet {
  id: string;
  text: string;
  relevance: number;
  drug: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'Drug' | 'Target' | 'Category';
  interactionCount?: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: 'INTERACTS_WITH' | 'TARGETS' | 'BELONGS_TO';
  severity?: 'critical' | 'major' | 'minor';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export type PillarView = 'search' | 'assistant' | 'safety' | 'graph' | 'alternatives';

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Alternative Drug Types
export interface AlternativeDrug {
  id: string;
  name: string;
  indication: string;
  conflicts: number;
}

export interface AlternativesResponse {
  source_drug: string;
  condition: string;
  alternatives: AlternativeDrug[];
}
