import type {
  QuizDefinition,
  QuizId,
  QuizQuestion,
  QuizSettings,
} from "../types/quiz";

type QuestionSeed = {
  readonly prompt: string;
  readonly options: readonly [string, string, string, string];
  readonly correctOptionIndex: number;
};

function buildSettings(
  quizId: QuizId,
  title: string,
  description: string,
): QuizSettings {
  return {
    quizId,
    title,
    description,
    durationMinutes: 10,
    questionCount: 20,
    isLive: true,
    updatedAt: Date.now(),
  };
}

function buildQuestions(
  quizId: QuizId,
  seeds: readonly QuestionSeed[],
): QuizQuestion[] {
  return seeds.map((seed, index) => ({
    id: `${quizId}-question-${(index + 1).toString().padStart(2, "0")}`,
    quizId,
    order: index + 1,
    prompt: seed.prompt,
    options: [...seed.options],
    correctOptionIndex: seed.correctOptionIndex,
    updatedAt: Date.now(),
  }));
}

export const quizCatalog: readonly QuizDefinition[] = [
  {
    id: "architects-gambit",
    label: "Architect's Gambit",
    title: "Architect's Gambit",
    description:
      "DSA, competitive programming, and AI/ML in one sharp 20-question sprint.",
  },
  {
    id: "hack-n-crack",
    label: "Hack'n'Crack",
    title: "Hack'n'Crack",
    description:
      "Web development, data analytics, and cloud fundamentals in a fast MCQ run.",
  },
];

const architectsGambitSeeds: readonly QuestionSeed[] = [
  {
    prompt:
      "Which platform is widely used for practicing DSA problems for coding interviews?",
    options: ["GitHub", "LeetCode", "Canva", "Notion"],
    correctOptionIndex: 1,
  },
  {
    prompt:
      "Which platform is famous for regular competitive programming contests and ratings?",
    options: ["Codeforces", "LinkedIn", "Reddit", "Figma"],
    correctOptionIndex: 0,
  },
  {
    prompt: "Find the next number: 3, 6, 12, 24, ?",
    options: ["36", "42", "48", "50"],
    correctOptionIndex: 2,
  },
  {
    prompt: "Find the missing letter: A, Z, B, Y, C, ?",
    options: ["X", "W", "V", "D"],
    correctOptionIndex: 0,
  },
  {
    prompt: "What will this print? int x = 5; int y = 3; cout << x + y * 2;",
    options: ["16", "11", "13", "10"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Which data structure follows LIFO?",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Which data structure follows FIFO?",
    options: ["Queue", "Stack", "Graph", "Heap"],
    correctOptionIndex: 0,
  },
  {
    prompt: "Which search algorithm works best on a sorted array?",
    options: ["Linear Search", "Binary Search", "DFS", "Bubble Sort"],
    correctOptionIndex: 1,
  },
  {
    prompt: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Which of these is generally the worst for large input sizes?",
    options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
    correctOptionIndex: 3,
  },
  {
    prompt: "What is recursion?",
    options: [
      "Repeating a loop forever",
      "A function calling itself",
      "Sorting in reverse",
      "Removing duplicates",
    ],
    correctOptionIndex: 1,
  },
  {
    prompt: "Which data structure is used internally in recursion?",
    options: ["Queue", "Stack", "Graph", "Linked List"],
    correctOptionIndex: 1,
  },
  {
    prompt:
      "Which programming language is most commonly used in AI and ML today?",
    options: ["C", "Java", "Python", "PHP"],
    correctOptionIndex: 2,
  },
  {
    prompt: "Which of these is a type of machine learning?",
    options: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
      "All of the above",
    ],
    correctOptionIndex: 3,
  },
  {
    prompt: "Netflix recommendations are examples of:",
    options: [
      "Cybersecurity",
      "Machine Learning",
      "Cloud Storage",
      "HTML",
    ],
    correctOptionIndex: 1,
  },
  {
    prompt: "Data used to teach a model is called:",
    options: ["Testing data", "Training data", "Output data", "Cache data"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Model performs well on training but poorly on new data:",
    options: ["Hashing", "Overfitting", "Backtracking", "Compression"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Example of classification:",
    options: ["Predict temperature", "Sorting", "Spam detection", "Max element"],
    correctOptionIndex: 2,
  },
  {
    prompt: "Find next: 2, 5, 10, 17, ?",
    options: ["24", "26", "28", "30"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Why optimize time complexity?",
    options: [
      "Longer code",
      "Colorful code",
      "Efficient for large inputs",
      "Avoid comments",
    ],
    correctOptionIndex: 2,
  },
];

const hackNCrackSeeds: readonly QuestionSeed[] = [
  {
    prompt: "Which language structures web pages?",
    options: ["CSS", "HTML", "Python", "SQL"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Which language styles web pages?",
    options: ["CSS", "C++", "Java", "SQL"],
    correctOptionIndex: 0,
  },
  {
    prompt: "Which language adds interactivity?",
    options: ["JavaScript", "C", "Excel", "Bash"],
    correctOptionIndex: 0,
  },
  {
    prompt: "Frontend library/framework?",
    options: ["React", "MySQL", "NumPy", "Docker"],
    correctOptionIndex: 0,
  },
  {
    prompt: "Runs in browser?",
    options: ["Backend", "Frontend", "Database", "Cloud"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Stores tabular data?",
    options: ["Database", "Compiler", "Browser", "Cache"],
    correctOptionIndex: 0,
  },
  {
    prompt: "SQL is used for:",
    options: ["Styling", "Querying DB", "AI", "Logos"],
    correctOptionIndex: 1,
  },
  {
    prompt: "URL stands for:",
    options: [
      "Uniform Resource Locator",
      "Universal Link",
      "User Locator",
      "Routing Lang",
    ],
    correctOptionIndex: 0,
  },
  {
    prompt: "Fetch data method?",
    options: ["PUSH", "GET", "RUN", "OPEN"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Browser does?",
    options: ["Backend", "Render pages", "Train AI", "Store cloud"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Data analytics is:",
    options: ["Insight extraction", "Game dev", "Circuits", "Hardware"],
    correctOptionIndex: 0,
  },
  {
    prompt: "Common analytics tools:",
    options: ["Excel", "Python", "SQL", "All"],
    correctOptionIndex: 3,
  },
  {
    prompt: "Best for categories?",
    options: ["Bar chart", "Pie", "Line", "Scatter"],
    correctOptionIndex: 0,
  },
  {
    prompt: "Best for trends?",
    options: ["Bar", "Line", "Histogram", "Table"],
    correctOptionIndex: 1,
  },
  {
    prompt: "First step for dirty data?",
    options: ["Ignore", "Cleaning", "Deploy", "Logo"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Cloud computing means:",
    options: ["Pendrive", "Internet services", "Drawing", "Compressing"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Cloud platform?",
    options: ["AWS", "VS Code", "Canva", "Compass"],
    correctOptionIndex: 0,
  },
  {
    prompt: "SaaS means:",
    options: [
      "Software via internet",
      "Infra",
      "Platform",
      "LAN",
    ],
    correctOptionIndex: 0,
  },
  {
    prompt: "Google Drive is:",
    options: ["Blockchain", "Cloud storage", "OS", "Compiler"],
    correctOptionIndex: 1,
  },
  {
    prompt: "Why cloud?",
    options: ["Avoid internet", "Scalability", "Remove DB", "Stop automation"],
    correctOptionIndex: 1,
  },
];

export const quizPresets: Record<
  QuizId,
  { readonly settings: QuizSettings; readonly questions: QuizQuestion[] }
> = {
  "architects-gambit": {
    settings: buildSettings(
      "architects-gambit",
      "Architect's Gambit",
      "20 MCQs across DSA, competitive programming, and AI/ML. Finish within 10 minutes.",
    ),
    questions: buildQuestions("architects-gambit", architectsGambitSeeds),
  },
  "hack-n-crack": {
    settings: buildSettings(
      "hack-n-crack",
      "Hack'n'Crack",
      "20 MCQs across web development, data analytics, and cloud. Finish within 10 minutes.",
    ),
    questions: buildQuestions("hack-n-crack", hackNCrackSeeds),
  },
};
