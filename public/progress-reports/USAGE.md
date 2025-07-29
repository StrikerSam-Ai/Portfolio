# 📝 Progress Reports - Quick Start Guide

Your daily progress tracking system is ready! Here's how to use it:

## 🚀 Creating Reports

> **Important**: All npm commands should be run from the project root directory (where package.json is located)

### Method 1: NPM Scripts (Recommended)
```bash
# Create today's detailed report
npm run report

# Create today's quick report (2-3 minutes)
npm run report:quick
```

### Method 2: Direct Script
```bash
# Navigate to progress-reports folder
cd public/progress-reports

# Create detailed report
node generate-report.js

# Create quick report
node generate-report.js quick
```

### Method 3: PowerShell (Windows)
```powershell
# Navigate to progress-reports folder
cd public/progress-reports

# Create detailed report
.\new-report.ps1

# Create quick report  
.\new-report.ps1 -Quick
```

## 📋 Daily Workflow

### Morning (2 minutes)
```bash
npm run report:quick
```
- Fill in your goals for the day
- Set mood and focus areas
- Quick planning

### Evening (5-10 minutes)
```bash
npm run report
```
- If quick report exists, it opens that
- If not, creates detailed template
- Fill in achievements, challenges, learnings
- Reflect on the day

## 📁 File Organization

Your reports are saved as:
```
public/progress-reports/
└── 2025/
    ├── day-001-2025-07-24.md    ← Example report
    ├── day-002-2025-07-25.md    ← Example report
    └── ...
```

## 🎯 Template Sections

### Quick Template
- ✅ Done Today
- 🚧 Challenges  
- 💡 Learned
- 🎯 Tomorrow

### Detailed Template
- 🎯 Today's Mission
- ⚡ What I Accomplished
- 🧗 Challenges & Solutions
- ⏰ Time Breakdown
- 💡 Key Insights & Learnings
- 🎮 Tomorrow's Quest
- 📊 Stats & Metrics
- 🎭 Reflection & Mood

## 💡 Pro Tips

1. **Consistency over Perfection**: Better to fill quick template daily than detailed template weekly

2. **Use Tags**: Add consistent tags like `React`, `AI`, `Learning` for easy filtering

3. **Streak Tracking**: The system auto-calculates your streaks

4. **Time Tracking**: Use the time breakdown table to spot patterns

5. **Copy Previous**: If similar day, copy previous report and modify

## 🔄 Integration with Portfolio

Your reports automatically appear in your portfolio's Progress Reports section with:
- Timeline view
- Statistics dashboard
- Mood tracking
- Streak calculations
- Tag filtering

## 🛠 Customization

### Add New Template Sections
Edit `templates/daily-template.md` or `templates/quick-template.md`

### Change Start Date
Edit `generate-report.js` line 18:
```javascript
const startDate = new Date('2024-01-01'); // Your journey start
```

### Modify File Naming
Edit the filename generation in `generate-report.js`

---

**Ready to start tracking? Run `npm run report:quick` now! 🚀**
