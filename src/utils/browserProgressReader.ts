// utils/browserProgressReader.ts
export interface ParsedProgressReport {
  day: number;
  date: string;
  title: string;
  mood?: string;
  productivityScore?: number;
  focusAreas?: string[];
  tags?: string[];
  content: string;
  filePath: string;
  achievements?: string[];
  challenges?: string[];
  learnings?: string[];
}

export interface ProgressStats {
  totalDays: number;
  averageScore: number;
  streak: number;
  totalAchievements: number;
  mostCommonMood: string;
  improvementTrend: 'up' | 'down' | 'stable';
  moodDistribution: Record<string, number>;
  weeklyScores: number[];
  focusAreas: string[];
  latestReport?: ParsedProgressReport;
  topTags: Array<{ tag: string; count: number }>;
  currentStreak: number;
  averageProductivity: number;
}

class BrowserProgressReader {
  private statsCache: ProgressStats | null = null;
  private reportsCache: ParsedProgressReport[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 30 * 1000; // 30 seconds

  // Get the correct base path for fetching files
  private getBasePath(): string {
    // Use Vite's BASE_URL which will be '/Portfolio/' in production and '/' in development
    return import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  }

  async getRecentReports(limit: number = 10): Promise<ParsedProgressReport[]> {
    const allReports = await this.scanProgressReportsFromFolder();
    return allReports.slice(0, limit);
  }

  async getAllReports(): Promise<ParsedProgressReport[]> {
    return await this.scanProgressReportsFromFolder();
  }

  // Scan the progress-reports/2025 folder for actual report files
    async scanProgressReportsFromFolder(): Promise<ParsedProgressReport[]> {
  // Check cache first
  const now = Date.now();
  if (this.reportsCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
    console.log('Using cached reports');
    return this.reportsCache;
  }

  console.log('🔄 Scanning for progress reports...');
  
  try {
    const reports: ParsedProgressReport[] = [];
    
    // Test exact files we know exist
    const knownFiles = [
      { filename: 'day-1-2025-07-24.md', day: 1, date: '2025-07-24' },
      { filename: 'day-2-2025-07-25.md', day: 2, date: '2025-07-25' },
      { filename: 'day-003-2025-07-26.md', day: 3, date: '2025-07-26' },
      { filename: 'day-004-2025-07-27.md', day: 4, date: '2025-07-27' },
      { filename: 'day-006-2025-07-29.md', day: 6, date: '2025-07-29' },
      { filename: 'day-007-2025-07-30.md', day: 7, date: '2025-07-30' },
      { filename: 'day-008-2025-07-31.md', day: 8, date: '2025-07-31' } // New file added
    ];
    
    for (const { filename, day, date } of knownFiles) {
      try {
        console.log(`🔍 Fetching: ${filename}`);
        const basePath = this.getBasePath();
        const response = await fetch(`${basePath}/progress-reports/2025/${filename}?t=${Date.now()}`);
        
        if (response.ok) {
          const content = await response.text();
          console.log(`✅ Got content (${content.length} chars) for ${filename}`);
          
          const parsed = this.parseMarkdownReport(content, filename, day, date);
          if (parsed) {
            console.log(`✅ Parsed successfully: ${parsed.title}`);
            reports.push(parsed);
          } else {
            console.log(`❌ Failed to parse ${filename}`);
          }
        } else {
          console.log(`❌ HTTP ${response.status} for ${filename}`);
        }
      } catch (error) {
        console.log(`❌ Error fetching ${filename}:`, error);
      }
    }

    console.log(`📊 Final result: ${reports.length} reports found`);
    reports.forEach(r => console.log(`  - Day ${r.day}: ${r.title} (${r.mood}, ${r.productivityScore}/10)`));
    
    const sortedReports = reports.sort((a, b) => b.day - a.day);
    
    // Cache the results
    this.reportsCache = sortedReports;
    this.cacheTimestamp = now;
    
    return sortedReports;
    
  } catch (error) {
    console.warn('❌ Scan failed:', error);
    return [];
  }
}

  private parseMarkdownReport(content: string, filename: string, day: number, date: string): ParsedProgressReport | null {
    try {
      console.log(`Parsing content for ${filename}...`);
      
      // Extract title from first heading
      const titleMatch = content.match(/^#\s+(.+)/m);
      const title = titleMatch ? titleMatch[1] : `Day ${day}`;

      // Extract mood - look for **Mood:** pattern specifically
      const moodMatch = content.match(/\*\*Mood:\*\*\s*([^\s|]+)/);
      const mood = moodMatch ? moodMatch[1] : '😊';

      // Extract score - look for **Score:** pattern specifically
      const scoreMatch = content.match(/\*\*Score:\*\*\s*(\d+)(?:\/10|\/100)?/);
      const productivityScore = scoreMatch ? parseInt(scoreMatch[1]) : undefined;

      // Extract tags - look for `#tag` format in your files
      const tagMatches = content.match(/`#[\w_]+`/g);
      const tags = tagMatches ? tagMatches.map(tag => tag.replace(/`/g, '')) : [];

      // Extract achievements from "## ✅ Done Today" section
      const achievements: string[] = [];
      const achievementMatch = content.match(/## ✅ Done Today([\s\S]*?)(?=##|$)/);
      if (achievementMatch) {
        const achievementText = achievementMatch[1];
        const items = achievementText.match(/- (.+)/g);
        if (items) {
          items.forEach(item => {
            const cleaned = item.replace(/^- /, '').trim();
            if (cleaned) {
              achievements.push(cleaned);
            }
          });
        }
      }

      // Extract learnings from "## 💡 Learned" section
      const learnings: string[] = [];
      const learningMatch = content.match(/## 💡 Learned([\s\S]*?)(?=##|$)/);
      if (learningMatch) {
        const learningText = learningMatch[1];
        const items = learningText.match(/- (.+)/g);
        if (items) {
          items.forEach(item => {
            const cleaned = item.replace(/^- /, '').trim();
            if (cleaned) {
              learnings.push(cleaned);
            }
          });
        }
      }

      // Extract challenges from "## 🚧 Challenges" section
      const challenges: string[] = [];
      const challengeMatch = content.match(/## 🚧 Challenges([\s\S]*?)(?=##|$)/);
      if (challengeMatch) {
        const challengeText = challengeMatch[1];
        const items = challengeText.match(/- (.+)/g);
        if (items) {
          items.forEach(item => {
            const cleaned = item.replace(/^- /, '').trim();
            if (cleaned) {
              challenges.push(cleaned);
            }
          });
        }
      }

      console.log(`✅ Successfully parsed Day ${day}: ${title}, Mood: ${mood}, Score: ${productivityScore}`);
      console.log(`   Achievements: ${achievements.length}, Learnings: ${learnings.length}, Challenges: ${challenges.length}`);
      
      const basePath = this.getBasePath();
      
      return {
        day,
        date,
        title,
        mood,
        productivityScore,
        focusAreas: undefined, // Your template doesn't have this
        tags: tags.length > 0 ? tags : undefined,
        content,
        filePath: `${basePath}/progress-reports/2025/${filename}`,
        achievements: achievements.length > 0 ? achievements : undefined,
        challenges: challenges.length > 0 ? challenges : undefined,
        learnings: learnings.length > 0 ? learnings : undefined
      };
    } catch (error) {
      console.warn(`Failed to parse report ${filename}:`, error);
      return null;
    }
  }

  async getStats(): Promise<ProgressStats> {
  if (this.statsCache) {
    return this.statsCache;
  }

  const reports = await this.getAllReports();
  
  const stats: ProgressStats = {
    totalDays: reports.length,
    averageScore: reports.reduce((acc, r) => acc + (r.productivityScore || 0), 0) / reports.length || 0,
    streak: this.calculateStreak(reports),
    totalAchievements: reports.reduce((acc, r) => acc + (r.achievements?.length || 0), 0),
    mostCommonMood: this.getMostCommonMood(reports),
    improvementTrend: this.calculateTrend(reports),
    moodDistribution: this.getMoodDistribution(reports),
    weeklyScores: this.getWeeklyScores(reports),
    focusAreas: this.getFocusAreas(reports),
    latestReport: reports[0], // Most recent report
    topTags: this.getTopTags(reports),
    currentStreak: this.calculateStreak(reports), // Same as streak
    averageProductivity: parseFloat((reports.reduce((acc, r) => acc + (r.productivityScore || 0), 0) / reports.length || 0).toFixed(1))
  };

  // Clear stats cache every 30 seconds
  setTimeout(() => {
    this.statsCache = null;
  }, 30000);

  this.statsCache = stats;
  return stats;
}

      private calculateStreak(reports: ParsedProgressReport[]): number {
    if (reports.length === 0) return 0;
    
    // Sort reports by day number in descending order (most recent first)
    const sortedReports = reports.sort((a, b) => b.day - a.day);
    
    // Calculate current streak from the most recent day backwards
    const startDate = new Date('2025-07-24T00:00:00');
    const today = new Date();
    
    // Set to start of day to avoid timezone issues
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDateStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    
    const diffTime = todayStart.getTime() - startDateStart.getTime();
    const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    let streak = 0;
    
    // Check if we have a report for today (current day)
    const hasToday = sortedReports.some(report => report.day === currentDay);
    if (!hasToday) {
      console.log(`📊 No report for today (day ${currentDay}), streak = 0`);
      return 0; // No streak if we don't have today's report
    }
    
    // Count consecutive days backwards from current day
    for (let day = currentDay; day >= 1; day--) {
      const hasReport = sortedReports.some(report => report.day === day);
      if (hasReport) {
        streak++;
      } else {
        break; // Break the streak if we find a missing day
      }
    }
    
    console.log(`📊 Streak calculation: Current day ${currentDay}, Reports: ${reports.length}, Streak: ${streak}`);
    return streak;
  }

  private getMostCommonMood(reports: ParsedProgressReport[]): string {
    const moodCounts: Record<string, number> = {};
    
    reports.forEach(report => {
      if (report.mood) {
        moodCounts[report.mood] = (moodCounts[report.mood] || 0) + 1;
      }
    });

    let mostCommon = '😊';
    let maxCount = 0;
    
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = mood;
      }
    });

    return mostCommon;
  }

  private calculateTrend(reports: ParsedProgressReport[]): 'up' | 'down' | 'stable' {
    if (reports.length < 2) return 'stable';
    
    const recent = reports.slice(0, 3);
    const older = reports.slice(3, 6);
    
    const recentAvg = recent.reduce((acc, r) => acc + (r.productivityScore || 0), 0) / recent.length;
    const olderAvg = older.reduce((acc, r) => acc + (r.productivityScore || 0), 0) / (older.length || 1);
    
    if (recentAvg > olderAvg + 0.5) return 'up';
    if (recentAvg < olderAvg - 0.5) return 'down';
    return 'stable';
  }

  private getMoodDistribution(reports: ParsedProgressReport[]): Record<string, number> {
    const distribution = {
      excellent: 0,
      good: 0,
      okay: 0,
      challenging: 0
    };

    reports.forEach(report => {
      if (report.mood) {
        if (report.mood.includes('🔥') || report.mood.includes('🌟') || report.mood.includes('💪') || report.mood.includes('excellent')) {
          distribution.excellent++;
        } else if (report.mood.includes('😌') || report.mood.includes('👍') || report.mood.includes('✨') || report.mood.includes('😊')) {
          distribution.good++;
        } else if (report.mood.includes('😐') || report.mood.includes('🤔') || report.mood.includes('💭')) {
          distribution.okay++;
        } else if (report.mood.includes('😓') || report.mood.includes('😰') || report.mood.includes('⚡') || report.mood.includes('tough')) {
          distribution.challenging++;
        } else {
          distribution.good++;
        }
      }
    });

    return distribution;
  }

  private getWeeklyScores(reports: ParsedProgressReport[]): number[] {
    return reports.slice(0, 7).map(r => r.productivityScore || 0).reverse();
  }

  private getFocusAreas(reports: ParsedProgressReport[]): string[] {
    const areas = new Set<string>();
    reports.forEach(report => {
      if (report.focusAreas) {
        report.focusAreas.forEach(area => areas.add(area));
      }
    });
    return Array.from(areas);
  }

  private getTopTags(reports: ParsedProgressReport[]): Array<{ tag: string; count: number }> {
    const tagCounts: Record<string, number> = {};
    
    reports.forEach(report => {
      if (report.tags) {
        report.tags.forEach(tag => {
          const cleanTag = tag.replace(/[`#{}]/g, '').trim();
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  async addReport(): Promise<void> {
    this.reportsCache = null;
    this.statsCache = null;
    this.cacheTimestamp = 0;
  }
}
 

export const browserProgressReader = new BrowserProgressReader();