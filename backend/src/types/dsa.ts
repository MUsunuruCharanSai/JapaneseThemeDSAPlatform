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

export interface CreateHeadingRequest {
  name: string;
}

export interface UpdateHeadingRequest {
  name: string;
}

export interface CreateSubheadingRequest {
  headingId: string;
  name: string;
}

export interface UpdateSubheadingRequest {
  name: string;
}

export interface CreateQuestionRequest {
  headingId: string;
  subheadingId: string;
  name: string;
  article: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  youtubeLink?: string;
  questionLink?: string;
}

export interface UpdateQuestionRequest {
  name?: string;
  article?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  youtubeLink?: string;
  questionLink?: string;
}

export interface UserProgress {
  userId: string;
  questionId: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgressRequest {
  questionId: string;
  completed: boolean;
}

export interface UserProgressResponse {
  success: boolean;
  progress: UserProgress[];
  totalQuestions: number;
  completedQuestions: number;
}
