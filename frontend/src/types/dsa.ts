export interface DSAQuestion {
  id: string;
  name: string;
  article: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  youtubeLink?: string;
  questionLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DSASubheading {
  id: string;
  name: string;
  questions: DSAQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DSAHeading {
  id: string;
  name: string;
  subheadings: DSASubheading[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DSASheetData {
  headings: DSAHeading[];
  lastUpdated: Date;
}

