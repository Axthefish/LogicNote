// Common Types for LogicNote

// UI Types
export type View = 'textInput' | 'graphView';

// Data Types
export interface SavedItem {
  id: string;
  type: 'text' | 'graph-source';
  title: string;
  date: string;
  preview?: string;
  content?: string;
  icon: React.ElementType;
}

export interface KnowledgeSystem {
  id: string;
  name: string;
  description?: string;
}

export interface KnowledgeTag {
  id: string;
  name: string;
  description?: string;
}

// Node Edit Types
export interface NodeData {
  id: string;
  userNotes?: string;
  applicabilityConditions?: string;
  userSignificance?: string;
  associatedTagIds?: string[];
}

// API Response Types
export interface TextAnalysisResponse {
  graphId: string;
  name?: string;
  nodes: any[];
  edges: any[];
  sourceText?: string;
}

export interface GraphResponse {
  id: string;
  name?: string;
  nodes: any[];
  edges: any[];
  sourceText?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SavedText {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

// Quick Save Types
export interface QuickSave {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

// Graph System Assignment
export interface GraphSystemAssignment {
  graphId: string;
  systemId: string;
  assignedAt: string;
} 