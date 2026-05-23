export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizAnswerOption[];
  sceneLabel?: string;
}

export interface QuizAnswerOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface InteractiveQuiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface InteractiveChecklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export type CompletionState = "not_started" | "in_progress" | "completed";

export const DEMO_ETHEN_QUIZ: InteractiveQuiz = {
  id: "quiz_ethen_overview_001",
  title: "Ethen Platform Overview",
  questions: [
    {
      id: "q1",
      text: "What rendering technology does Live Avatar use in the browser?",
      options: [
        { id: "q1a", text: "WebGPU and Canvas2D", correct: false },
        { id: "q1b", text: "WebGL and Three.js", correct: true },
        { id: "q1c", text: "React Native and Skia", correct: false },
        { id: "q1d", text: "CSS 3D Transforms", correct: false },
      ],
      sceneLabel: "Live Avatar",
    },
    {
      id: "q2",
      text: "What can Live Avatar avatars do for website visitors?",
      options: [
        { id: "q2a", text: "Only display pre-recorded videos", correct: false },
        {
          id: "q2b",
          text: "Greet visitors, answer questions, qualify leads, and book meetings",
          correct: true,
        },
        { id: "q2c", text: "Replace the entire website CMS", correct: false },
        { id: "q2d", text: "Manage email marketing campaigns", correct: false },
      ],
      sceneLabel: "Live Avatar",
    },
    {
      id: "q3",
      text: "What input types does Studio support for generating videos?",
      options: [
        { id: "q3a", text: "Script, document, or URL", correct: true },
        { id: "q3b", text: "Only pre-recorded video files", correct: false },
        { id: "q3c", text: "Only typed scripts", correct: false },
        { id: "q3d", text: "Only PowerPoint slides", correct: false },
      ],
      sceneLabel: "Studio",
    },
    {
      id: "q4",
      text: "What makes Interactive Video Pages different from regular hosted videos?",
      options: [
        {
          id: "q4a",
          text: "They are only available on mobile devices",
          correct: false,
        },
        {
          id: "q4b",
          text: "They include transcript, Q&A, quizzes, lead capture, and analytics",
          correct: true,
        },
        {
          id: "q4c",
          text: "They automatically translate into 50 languages",
          correct: false,
        },
        {
          id: "q4d",
          text: "They are streamed in 8K resolution",
          correct: false,
        },
      ],
      sceneLabel: "Interactive Video Pages",
    },
    {
      id: "q5",
      text: "What does the Avatar API let developers do?",
      options: [
        { id: "q5a", text: "Only render avatars in Unity", correct: false },
        {
          id: "q5b",
          text: "Build custom avatar experiences with personas, sessions, and webhooks",
          correct: true,
        },
        {
          id: "q5c",
          text: "Train custom machine learning models",
          correct: false,
        },
        { id: "q5d", text: "Host websites on the Upcube CDN", correct: false },
      ],
      sceneLabel: "Avatar API",
    },
  ],
};

export const DEMO_CHECKLIST_WEBSITE_AVATAR: InteractiveChecklist = {
  id: "checklist_website_avatar_001",
  title: "Launch a Website Avatar",
  items: [
    {
      id: "c1",
      text: "Choose your avatar persona and voice",
      completed: false,
    },
    {
      id: "c2",
      text: "Configure greeting message and behavior",
      completed: false,
    },
    { id: "c3", text: "Upload product knowledge base", completed: false },
    {
      id: "c4",
      text: "Set lead capture and booking options",
      completed: false,
    },
    { id: "c5", text: "Preview avatar on staging page", completed: false },
    { id: "c6", text: "Publish avatar to production site", completed: false },
    {
      id: "c7",
      text: "Monitor conversation logs and quality",
      completed: false,
    },
  ],
};

export const DEMO_CHECKLIST_TRAINING_PAGE: InteractiveChecklist = {
  id: "checklist_training_page_001",
  title: "Prepare an Interactive Training Page",
  items: [
    {
      id: "t1",
      text: "Write training script or upload source document",
      completed: false,
    },
    { id: "t2", text: "Generate avatar training video", completed: false },
    { id: "t3", text: "Add quiz questions based on content", completed: false },
    { id: "t4", text: "Configure lead capture form", completed: false },
    { id: "t5", text: "Enable transcript Q&A overlay", completed: false },
    { id: "t6", text: "Publish hosted training page", completed: false },
    { id: "t7", text: "Review learner engagement analytics", completed: false },
  ],
};

export function scoreQuizLocally(
  quiz: InteractiveQuiz,
  answers: Record<string, string>,
): { score: number; total: number; correctIds: string[]; wrongIds: string[] } {
  let score = 0;
  const correctIds: string[] = [];
  const wrongIds: string[] = [];

  for (const question of quiz.questions) {
    const selected = answers[question.id];
    const correctOption = question.options.find((o) => o.correct);
    if (selected && correctOption && selected === correctOption.id) {
      score++;
      correctIds.push(question.id);
    } else {
      wrongIds.push(question.id);
    }
  }

  return { score, total: quiz.questions.length, correctIds, wrongIds };
}

export function calculateChecklistCompletion(checklist: InteractiveChecklist): {
  completed: number;
  total: number;
  percent: number;
  done: boolean;
} {
  const completed = checklist.items.filter((i) => i.completed).length;
  const total = checklist.items.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent, done: completed === total };
}

export function createDefaultInteractiveChecklist(
  overrides?: Partial<InteractiveChecklist>,
): InteractiveChecklist {
  return {
    id: `checklist_${Date.now()}`,
    title: "Next Steps",
    items: [],
    ...overrides,
  };
}
