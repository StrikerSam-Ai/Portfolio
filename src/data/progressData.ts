export interface DailyProgress {
  day: number;
  date: string;
  title: string;
  mood: 'excellent' | 'good' | 'okay' | 'challenging' | 'tough';
  focusAreas: string[];
  achievements: string[];
  challenges: string[];
  learnings: string[];
  nextGoals: string[];
  productivityScore: number; // 1-10
  tags: string[];
  timeSpent: { [activity: string]: number }; // hours
  snippet: string; // Short description
  reflection?: string; // Optional longer reflection
}

// Sample data to get started
export const sampleProgressData: DailyProgress[] = [
  {
    day: 250,
    date: "2025-07-22",
    title: "Portfolio Enhancement & Modal Implementation",
    mood: "excellent",
    focusAreas: ["Frontend Development", "UI/UX", "React"],
    achievements: [
      "Implemented sophisticated iframe modal system",
      "Added fallback mechanisms for Medium posts",
      "Enhanced user experience with glassmorphism design"
    ],
    challenges: [
      "Medium iframe blocking due to X-Frame-Options",
      "Balancing functionality with clean UX"
    ],
    learnings: [
      "Content Security Policy implications",
      "Progressive enhancement strategies",
      "Effective error handling in React"
    ],
    nextGoals: [
      "Add progress dashboard",
      "Implement data visualization",
      "Create export functionality"
    ],
    productivityScore: 9,
    tags: ["React", "TypeScript", "Modal", "UI/UX"],
    timeSpent: {
      "Coding": 6,
      "Research": 2,
      "Testing": 1.5,
      "Documentation": 0.5
    },
    snippet: "Built an enhanced modal system with intelligent fallbacks for blocked content, showcasing problem-solving skills and user-centric design.",
    reflection: "Today was incredibly productive. The iframe blocking issue turned into an opportunity to create something even better - a modal system that gracefully handles failures and provides multiple user options."
  },
  {
    day: 249,
    date: "2025-07-21",
    title: "Data Visualization & Chart Integration",
    mood: "good",
    focusAreas: ["Data Visualization", "Chart.js", "Performance"],
    achievements: [
      "Integrated Chart.js with React components",
      "Created responsive radar charts for skills",
      "Added smooth animations and transitions"
    ],
    challenges: [
      "Chart responsiveness on mobile devices",
      "Memory management with chart instances"
    ],
    learnings: [
      "Chart.js best practices",
      "Canvas performance optimization",
      "React ref management for third-party libraries"
    ],
    nextGoals: [
      "Add more chart types",
      "Implement data export features",
      "Optimize for mobile experience"
    ],
    productivityScore: 8,
    tags: ["Chart.js", "Data Visualization", "React", "Performance"],
    timeSpent: {
      "Coding": 5,
      "Research": 3,
      "Testing": 2
    },
    snippet: "Enhanced portfolio with interactive data visualizations, demonstrating technical skills in both frontend development and data presentation.",
    reflection: "Working with Chart.js taught me a lot about canvas performance and the importance of proper cleanup in React components."
  },
  {
    day: 248,
    date: "2025-07-20",
    title: "Authentication System Design",
    mood: "challenging",
    focusAreas: ["Security", "Authentication", "System Design"],
    achievements: [
      "Researched modern auth patterns",
      "Designed secure session management",
      "Implemented JWT token validation"
    ],
    challenges: [
      "Complex token refresh logic",
      "Balancing security with UX",
      "Cross-tab session synchronization"
    ],
    learnings: [
      "JWT security considerations",
      "OAuth 2.0 flow implementation",
      "Secure storage best practices"
    ],
    nextGoals: [
      "Implement multi-factor authentication",
      "Add social login options",
      "Create admin dashboard"
    ],
    productivityScore: 7,
    tags: ["Authentication", "Security", "JWT", "System Design"],
    timeSpent: {
      "Research": 4,
      "Coding": 3,
      "Planning": 2,
      "Documentation": 1
    },
    snippet: "Deep dive into authentication systems, focusing on security best practices and user experience optimization.",
    reflection: "Security is complex, but understanding the fundamentals is crucial for building trustworthy applications."
  }
];

// Utility functions
export const getMoodEmoji = (mood: string): string => {
  const moodEmojis: { [key: string]: string } = {
    excellent: "🚀",
    good: "😊",
    okay: "😐",
    challenging: "😅",
    tough: "😤"
  };
  return moodEmojis[mood] || "😊";
};

export const getMoodColor = (mood: string): string => {
  const moodColors: { [key: string]: string } = {
    excellent: "#00ff88",
    good: "#ffb347",
    okay: "#ffd700",
    challenging: "#ff8c42",
    tough: "#ff6b6b"
  };
  return moodColors[mood] || "#ffb347";
};

export const calculateStreak = (data: DailyProgress[]): number => {
  if (data.length === 0) return 0;
  
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedData.length; i++) {
    const entryDate = new Date(sortedData[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    
    if (entryDate.toDateString() === expectedDate.toDateString()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getProductivityTrend = (data: DailyProgress[]): number[] => {
  return data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => entry.productivityScore);
};

export const getTopTags = (data: DailyProgress[]): { tag: string; count: number }[] => {
  const tagCounts: { [key: string]: number } = {};
  
  data.forEach(entry => {
    entry.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
};
