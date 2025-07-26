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

  // Sample progress report from your actual file to show the format
  private sampleReports: ParsedProgressReport[] = [
    {
      day: 1,
      date: '2025-07-24',
      title: 'Day 1: Quick Entry',
      mood: '😊',
      productivityScore: 8,
      focusAreas: ['progress system', 'dashboard', 'learning'],
      tags: ['#the_beginning', '#I_made_it', '#random_learning'],
      content: `# Day 1: Quick Entry

**Date:** 2025-07-24 | **Mood:** 😊 | **Score:** 8/10

## ✅ Done Today
- made progress report system
- made a wonderful & unique dashboard

## 🚧 Challenges
- health wise challenge(felt tired and low in energy)

## 💡 Learned
- AI vs AGI
- Aptitude and python

## 🎯 Tomorrow
- more efficiency
- academics and self learning progress

**Tags:** \`#the_beginning\` \`#I_made_it\` \`#random_learning\``,
      filePath: '/progress-reports/2025/day-1-2025-07-24.md',
      achievements: [
        'made progress report system',
        'made a wonderful & unique dashboard'
      ],
      challenges: [
        'health wise challenge(felt tired and low in energy)'
      ],
      learnings: [
        'AI vs AGI',
        'Aptitude and python'
      ]
    },
    {
      day: 2,
      date: '2025-07-25',
      title: 'Day 2: Not a wonderful day',
      mood: 'tough 😭',
      productivityScore: 5,
      focusAreas: ['project completion', 'course completion', 'self improvement'],
      tags: ['#elderhub', '#portfolio', '#completion'],
      content: `# Day 2: 25/7/2025 - Not a wonderful day

## ✅ What I Accomplished
- completely submitted elderhub repo on git
- updated portfolio projects section
- added dynamic content to about me section

## 🧗 Challenges & Solutions
- Project deadline pressure and debugging issues
- Portfolio dynamic content integration

## ⏰ Time Breakdown: 9 hours total
- 💻 Coding: 3 hours
- 🐛 Debugging: 2 hours
- 📖 Learning: 1 hour`,
      filePath: '/progress-reports/2025/day-2-2025-07-25.md',
      achievements: [
        'completely submitted elderhub repo on git',
        'updated portfolio projects section',
        'added dynamic content to about me section'
      ],
      challenges: [
        'Project deadline pressure and debugging issues',
        'Portfolio dynamic content integration'
      ],
      learnings: [
        'Portfolio dynamic content management',
        'Project deployment and submission processes'
      ]
    }
  ];

  async getRecentReports(limit: number = 10): Promise<ParsedProgressReport[]> {
    // In a real implementation, this would fetch from your progress-reports folder
    // For now, we'll use the sample data
    return this.sampleReports.slice(0, limit);
  }

  async getAllReports(): Promise<ParsedProgressReport[]> {
    return this.sampleReports;
  }

  async getStats(): Promise<ProgressStats> {
    if (this.statsCache) {
      return this.statsCache;
    }

    const reports = await this.getAllReports();
    
    const stats: ProgressStats = {
      totalDays: reports.length,
      averageScore: reports.reduce((acc, r) => acc + (r.productivityScore || 0), 0) / reports.length,
      streak: this.calculateStreak(reports),
      totalAchievements: reports.reduce((acc, r) => acc + (r.achievements?.length || 0), 0),
      mostCommonMood: this.getMostCommonMood(reports),
      improvementTrend: this.calculateTrend(reports),
      moodDistribution: this.getMoodDistribution(reports),
      weeklyScores: this.getWeeklyScores(reports),
      focusAreas: this.getFocusAreas(reports),
      latestReport: reports[0], // Most recent report
      topTags: this.getTopTags(reports),
      currentStreak: this.calculateStreak(reports), // Same as streak for now
      averageProductivity: parseFloat((reports.reduce((acc, r) => acc + (r.productivityScore || 0), 0) / reports.length).toFixed(1))
    };

    this.statsCache = stats;
    return stats;
  }

  private calculateStreak(reports: ParsedProgressReport[]): number {
    // Simple streak calculation - consecutive days with reports
    return reports.length; // For now, all days count as streak
  }

  private getMostCommonMood(reports: ParsedProgressReport[]): string {
    const moodCounts: Record<string, number> = {};
    reports.forEach(r => {
      if (r.mood) {
        moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
      }
    });
    
    return Object.entries(moodCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '😊';
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
    const distribution: Record<string, number> = {
      'excellent': 0,
      'good': 0,
      'okay': 0,
      'challenging': 0,
      'tough': 0
    };

    reports.forEach(report => {
      if (report.mood) {
        // Map emoji moods to categories
        if (report.mood.includes('😊') || report.mood.includes('😄') || report.mood.includes('🎉')) {
          distribution.excellent++;
        } else if (report.mood.includes('😌') || report.mood.includes('👍') || report.mood.includes('✨')) {
          distribution.good++;
        } else if (report.mood.includes('😐') || report.mood.includes('🤔') || report.mood.includes('💭')) {
          distribution.okay++;
        } else if (report.mood.includes('😓') || report.mood.includes('😰') || report.mood.includes('⚡')) {
          distribution.challenging++;
        } else {
          distribution.good++; // Default fallback
        }
      }
    });

    return distribution;
  }

  private getWeeklyScores(reports: ParsedProgressReport[]): number[] {
    // For now, return last 7 days of scores
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

  // Method to add new reports (for future expansion)
  async addReport(report: ParsedProgressReport): Promise<void> {
    this.sampleReports.unshift(report);
    this.statsCache = null; // Invalidate cache
  }
}

export const browserProgressReader = new BrowserProgressReader();
