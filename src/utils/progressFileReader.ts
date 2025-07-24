// utils/progressFileReader.ts
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

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

export class ProgressFileReader {
  private reportsDir: string;

  constructor(reportsDir: string = './progress-reports') {
    this.reportsDir = reportsDir;
  }

  async getAllReports(): Promise<ParsedProgressReport[]> {
    const reports: ParsedProgressReport[] = [];
    
    try {
      // Get all years
      const years = fs.readdirSync(this.reportsDir)
        .filter((item: string) => !item.includes('.') && !item.includes('templates'))
        .sort((a: string, b: string) => parseInt(b) - parseInt(a)); // Latest first

      for (const year of years) {
        const yearPath = path.join(this.reportsDir, year);
        const files = fs.readdirSync(yearPath)
          .filter((file: string) => file.endsWith('.md'))
          .sort((a: string, b: string) => {
            // Sort by day number (descending)
            const dayA = parseInt(a.match(/day-(\d+)/)?.[1] || '0');
            const dayB = parseInt(b.match(/day-(\d+)/)?.[1] || '0');
            return dayB - dayA;
          });

        for (const file of files) {
          const filePath = path.join(yearPath, file);
          const report = await this.parseReport(filePath);
          if (report) {
            reports.push(report);
          }
        }
      }

      return reports;
    } catch (error) {
      console.error('Error reading progress reports:', error);
      return [];
    }
  }

  private async parseReport(filePath: string): Promise<ParsedProgressReport | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      // Extract data from filename
      const filename = path.basename(filePath);
      const dayMatch = filename.match(/day-(\d+)-(\d{4}-\d{2}-\d{2})/);
      
      if (!dayMatch) return null;
      
      const day = parseInt(dayMatch[1]);
      const date = dayMatch[2];
      
      // Extract title from first line
      const titleMatch = markdownContent.match(/^# Day \d+:?\s*(.+)$/m);
      const title = titleMatch?.[1]?.trim() || `Day ${day}`;
      
      // Extract mood from content
      const moodMatch = markdownContent.match(/\*\*Mood:\*\*\s*([^{}\n]+)/);
      const mood = moodMatch?.[1]?.trim();
      
      // Extract productivity score
      const scoreMatch = markdownContent.match(/\*\*(?:Productivity )?Score:\*\*\s*(\d+)/);
      const productivityScore = scoreMatch ? parseInt(scoreMatch[1]) : undefined;
      
      // Extract focus areas/tags
      const focusMatch = markdownContent.match(/\*\*Focus Areas:\*\*\s*([^\n]+)/);
      const focusAreas = focusMatch?.[1]?.split(/[,;]/).map((s: string) => s.trim()) || [];
      
      // Extract tags
      const tagsMatch = markdownContent.match(/`([^`]+)`/g);
      const tags = tagsMatch?.map((tag: string) => tag.replace(/`/g, '')) || [];
      
      // Extract achievements
      const achievementsSection = markdownContent.match(/## ⚡ What I Accomplished[\s\S]*?(?=##|$)/);
      const achievements = this.extractListItems(achievementsSection?.[0] || '', /- ✅\s*(.+)/g);
      
      // Extract challenges
      const challengesSection = markdownContent.match(/## 🧗 Challenges[\s\S]*?(?=##|$)/);
      const challenges = this.extractListItems(challengesSection?.[0] || '', /- 🚧\s*\*\*Challenge:\*\*\s*(.+)/g);
      
      // Extract learnings
      const learningsSection = markdownContent.match(/## 💡 (?:Key Insights & )?Learned?[\s\S]*?(?=##|$)/);
      const learnings = this.extractListItems(learningsSection?.[0] || '', /- (?:📚|🔑)\s*(.+)/g);

      return {
        day,
        date,
        title: title.replace(/^.*?-\s*/, ''), // Remove "Quick Entry" or date prefix
        mood,
        productivityScore,
        focusAreas,
        tags,
        content: markdownContent,
        filePath,
        achievements,
        challenges,
        learnings,
        ...frontmatter // Include any frontmatter data
      };
    } catch (error) {
      console.error(`Error parsing report ${filePath}:`, error);
      return null;
    }
  }

  private extractListItems(section: string, regex: RegExp): string[] {
    const items: string[] = [];
    let match;
    
    while ((match = regex.exec(section)) !== null) {
      items.push(match[1].trim());
    }
    
    return items;
  }

  // Get reports for specific date range
  async getReportsByDateRange(startDate: string, endDate?: string): Promise<ParsedProgressReport[]> {
    const allReports = await this.getAllReports();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    return allReports.filter(report => {
      const reportDate = new Date(report.date);
      return reportDate >= start && reportDate <= end;
    });
  }

  // Get recent reports
  async getRecentReports(count: number = 10): Promise<ParsedProgressReport[]> {
    const allReports = await this.getAllReports();
    return allReports.slice(0, count);
  }

  // Calculate statistics
  async getStats() {
    const reports = await this.getAllReports();
    
    if (reports.length === 0) {
      return {
        totalDays: 0,
        currentStreak: 0,
        averageProductivity: 0,
        moodDistribution: {},
        topTags: [],
        totalAchievements: 0
      };
    }

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const sortedReports = reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (let i = 0; i < sortedReports.length; i++) {
      const reportDate = new Date(sortedReports[i].date);
      const daysDiff = Math.floor((today.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate average productivity
    const productivityScores = reports
      .map(r => r.productivityScore)
      .filter(score => typeof score === 'number') as number[];
    
    const averageProductivity = productivityScores.length > 0
      ? productivityScores.reduce((sum, score) => sum + score, 0) / productivityScores.length
      : 0;

    // Mood distribution
    const moodDistribution: { [key: string]: number } = {};
    reports.forEach(report => {
      if (report.mood) {
        const mood = report.mood.toLowerCase().replace(/[^a-z]/g, '');
        moodDistribution[mood] = (moodDistribution[mood] || 0) + 1;
      }
    });

    // Top tags
    const tagCounts: { [key: string]: number } = {};
    reports.forEach(report => {
      report.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const topTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Total achievements
    const totalAchievements = reports.reduce((sum, report) => 
      sum + (report.achievements?.length || 0), 0
    );

    return {
      totalDays: reports.length,
      currentStreak,
      averageProductivity: Math.round(averageProductivity * 10) / 10,
      moodDistribution,
      topTags,
      totalAchievements,
      latestReport: reports[0],
      oldestReport: reports[reports.length - 1]
    };
  }
}

export const progressReader = new ProgressFileReader();
