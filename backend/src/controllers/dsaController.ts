import { Request, Response } from 'express';
import {
  loadDSASheetData,
  createHeading as createHeadingInDB,
  updateHeading as updateHeadingInDB,
  deleteHeading as deleteHeadingInDB,
  createSubheading as createSubheadingInDB,
  updateSubheading as updateSubheadingInDB,
  deleteSubheading as deleteSubheadingInDB,
  createQuestion as createQuestionInDB,
  updateQuestion as updateQuestionInDB,
  deleteQuestion as deleteQuestionInDB,
  getUserProgressFromDB,
  updateUserProgressInDB
} from '../utils/dsaStorage';
import {
  DSAHeading,
  DSASubheading,
  DSAQuestion,
  CreateHeadingRequest,
  UpdateHeadingRequest,
  CreateSubheadingRequest,
  UpdateSubheadingRequest,
  CreateQuestionRequest,
  UpdateQuestionRequest
} from '../types/dsa';

// Get all DSA sheet data
export const getDSASheetData = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await loadDSASheetData();
    res.status(200).json({
      success: true,
      data,
      message: 'DSA sheet data retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve DSA sheet data'
    });
  }
};

// Create new heading
export const createHeading = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name }: CreateHeadingRequest = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Heading name is required'
      });
      return;
    }

    const newHeading: Omit<DSAHeading, 'id'> = {
      name: name.trim(),
      subheadings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdHeading = await createHeadingInDB(newHeading);

    res.status(201).json({
      success: true,
      heading: createdHeading,
      message: 'Heading created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create heading'
    });
  }
};

// Update heading
export const updateHeading = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name }: UpdateHeadingRequest = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Heading name is required'
      });
      return;
    }

    await updateHeadingInDB(id, { name: name.trim() });

    // Return the updated heading data
    const data = await loadDSASheetData();
    const heading = data.headings.find(h => h.id === id);

    if (!heading) {
      res.status(404).json({
        success: false,
        message: 'Heading not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      heading,
      message: 'Heading updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update heading'
    });
  }
};

// Delete heading
export const deleteHeading = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await deleteHeadingInDB(id);

    res.status(200).json({
      success: true,
      message: 'Heading deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete heading'
    });
  }
};

// Create subheading under a heading
export const createSubheading = async (req: Request, res: Response): Promise<void> => {
  try {
    const { headingId, name }: CreateSubheadingRequest = req.body;

    if (!headingId || !name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Heading ID and subheading name are required'
      });
      return;
    }

    // Verify heading exists
    const data = await loadDSASheetData();
    const heading = data.headings.find(h => h.id === headingId);

    if (!heading) {
      res.status(404).json({
        success: false,
        message: 'Heading not found'
      });
      return;
    }

    const newSubheading: Omit<DSASubheading, 'id'> = {
      name: name.trim(),
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdSubheading = await createSubheadingInDB(headingId, newSubheading);

    res.status(201).json({
      success: true,
      subheading: createdSubheading,
      message: 'Subheading created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create subheading'
    });
  }
};

// Update subheading
export const updateSubheading = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name }: UpdateSubheadingRequest = req.body;

    if (!name || !name.trim()) {
      res.status(400).json({
        success: false,
        message: 'Subheading name is required'
      });
      return;
    }

    // Find the heading that contains this subheading
    const data = await loadDSASheetData();
    let headingId: string | null = null;

    for (const heading of data.headings) {
      const subheading = heading.subheadings.find(sub => sub.id === id);
      if (subheading) {
        headingId = heading.id;
        break;
      }
    }

    if (!headingId) {
      res.status(404).json({
        success: false,
        message: 'Subheading not found'
      });
      return;
    }

    await updateSubheadingInDB(headingId, id, { name: name.trim() });

    // Return the updated subheading data
    const updatedData = await loadDSASheetData();
    const heading = updatedData.headings.find(h => h.id === headingId);
    const subheading = heading?.subheadings.find(sub => sub.id === id);

    if (!subheading) {
      res.status(404).json({
        success: false,
        message: 'Subheading not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      subheading,
      message: 'Subheading updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update subheading'
    });
  }
};

// Delete subheading
export const deleteSubheading = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the heading that contains this subheading
    const data = await loadDSASheetData();
    let headingId: string | null = null;

    for (const heading of data.headings) {
      const subheading = heading.subheadings.find(sub => sub.id === id);
      if (subheading) {
        headingId = heading.id;
        break;
      }
    }

    if (!headingId) {
      res.status(404).json({
        success: false,
        message: 'Subheading not found'
      });
      return;
    }

    await deleteSubheadingInDB(headingId, id);

    res.status(200).json({
      success: true,
      message: 'Subheading deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete subheading'
    });
  }
};

// Create question under a subheading
export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { headingId, subheadingId, name, article, difficulty, youtubeLink, questionLink }: CreateQuestionRequest = req.body;

    if (!headingId || !subheadingId || !name || !article || !difficulty) {
      res.status(400).json({
        success: false,
        message: 'Heading ID, subheading ID, name, article, and difficulty are required'
      });
      return;
    }

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      res.status(400).json({
        success: false,
        message: 'Difficulty must be Easy, Medium, or Hard'
      });
      return;
    }

    // Verify heading and subheading exist
    const data = await loadDSASheetData();
    const heading = data.headings.find(h => h.id === headingId);

    if (!heading) {
      res.status(404).json({
        success: false,
        message: 'Heading not found'
      });
      return;
    }

    const subheading = heading.subheadings.find(s => s.id === subheadingId);

    if (!subheading) {
      res.status(404).json({
        success: false,
        message: 'Subheading not found'
      });
      return;
    }

    const newQuestion: Omit<DSAQuestion, 'id'> = {
      name: name.trim(),
      article: article.trim(),
      difficulty,
      youtubeLink: youtubeLink?.trim() || undefined,
      questionLink: questionLink?.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdQuestion = await createQuestionInDB(headingId, subheadingId, newQuestion);

    res.status(201).json({
      success: true,
      question: createdQuestion,
      message: 'Question created successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create question'
    });
  }
};

// Update question
export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, article, difficulty, youtubeLink, questionLink }: UpdateQuestionRequest = req.body;

    if (difficulty && !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      res.status(400).json({
        success: false,
        message: 'Difficulty must be Easy, Medium, or Hard'
      });
      return;
    }

    // Find the question's path (headingId, subheadingId, questionId)
    const data = await loadDSASheetData();
    let headingId: string | null = null;
    let subheadingId: string | null = null;

    for (const heading of data.headings) {
      for (const subheading of heading.subheadings) {
        const question = subheading.questions.find(q => q.id === id);
        if (question) {
          headingId = heading.id;
          subheadingId = subheading.id;
          break;
        }
      }
      if (headingId) break;
    }

    if (!headingId || !subheadingId) {
      res.status(404).json({
        success: false,
        message: 'Question not found'
      });
      return;
    }

    const updates: Partial<Pick<DSAQuestion, 'name' | 'article' | 'difficulty' | 'youtubeLink' | 'questionLink'>> = {};
    if (name !== undefined) updates.name = name.trim();
    if (article !== undefined) updates.article = article.trim();
    if (difficulty !== undefined) updates.difficulty = difficulty;
    if (youtubeLink !== undefined) updates.youtubeLink = youtubeLink?.trim() || undefined;
    if (questionLink !== undefined) updates.questionLink = questionLink?.trim() || undefined;

    await updateQuestionInDB(headingId, subheadingId, id, updates);

    // Return the updated question data
    const updatedData = await loadDSASheetData();
    const heading = updatedData.headings.find(h => h.id === headingId);
    const subheading = heading?.subheadings.find(s => s.id === subheadingId);
    const question = subheading?.questions.find(q => q.id === id);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      question,
      message: 'Question updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update question'
    });
  }
};

// Delete question
export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find the question's path (headingId, subheadingId, questionId)
    const data = await loadDSASheetData();
    let headingId: string | null = null;
    let subheadingId: string | null = null;

    for (const heading of data.headings) {
      for (const subheading of heading.subheadings) {
        const question = subheading.questions.find(q => q.id === id);
        if (question) {
          headingId = heading.id;
          subheadingId = subheading.id;
          break;
        }
      }
      if (headingId) break;
    }

    if (!headingId || !subheadingId) {
      res.status(404).json({
        success: false,
        message: 'Question not found'
      });
      return;
    }

    await deleteQuestionInDB(headingId, subheadingId, id);

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete question'
    });
  }
};

// Get user progress
export const getUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.uid;
    const progress = await getUserProgressFromDB(userId);

    // Get total questions count
    const data = await loadDSASheetData();
    const totalQuestions = data.headings.reduce((acc, heading) =>
      acc + heading.subheadings.reduce((acc2, subheading) =>
        acc2 + subheading.questions.length, 0
      ), 0
    );

    const completedQuestions = progress.filter(p => p.completed).length;

    res.status(200).json({
      success: true,
      progress,
      totalQuestions,
      completedQuestions,
      message: 'User progress retrieved successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user progress'
    });
  }
};

// Update user progress
export const updateUserProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.uid;
    const { questionId, completed }: { questionId: string; completed: boolean } = req.body;

    await updateUserProgressInDB(userId, questionId, completed);

    // Get updated progress for response
    const progress = await getUserProgressFromDB(userId);

    // Get total questions count
    const data = await loadDSASheetData();
    const totalQuestions = data.headings.reduce((acc, heading) =>
      acc + heading.subheadings.reduce((acc2, subheading) =>
        acc2 + subheading.questions.length, 0
      ), 0
    );

    const completedQuestions = progress.filter(p => p.completed).length;

    res.status(200).json({
      success: true,
      progress,
      totalQuestions,
      completedQuestions,
      message: 'User progress updated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user progress'
    });
  }
};
