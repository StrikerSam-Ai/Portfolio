# Progress Reports System

This directory contains my daily progress tracking system.

## 📁 Structure
```
progress-reports/
├── templates/           # Report templates
│   ├── daily-template.md    # Comprehensive daily template
│   └── quick-template.md    # Quick entry template
├── 2025/               # Year-based organization
│   ├── day-XXX-YYYY-MM-DD.md
│   └── ...
├── generate-report.js  # Auto-generator script
└── README.md          # This file
```

## 🚀 Quick Start

### Option 1: Manual Creation
1. Copy a template from `templates/`
2. Rename with current date: `day-XXX-YYYY-MM-DD.md`
3. Fill in the details

### Option 2: Auto-Generation (Recommended)
```bash
# Generate today's full report
node generate-report.js

# Generate quick report
node generate-report.js quick
```

## 📝 Templates

### Daily Template (Comprehensive)
- Complete structure with all sections
- Time tracking
- Detailed reflection
- Perfect for important days

### Quick Template (Fast Entry)
- Essential fields only
- 2-3 minute entry
- Perfect for busy days

## 🎯 Usage Tips

1. **Daily Routine**: Run script each morning/evening
2. **Consistency**: Try to fill at least the quick template daily
3. **Review**: Look back weekly to spot patterns
4. **Tags**: Use consistent tags for easy filtering

## 🔄 Integration with Portfolio

The reports in this folder automatically sync with the portfolio's progress section via a file reader that:
- Scans for `.md` files
- Parses frontmatter and content
- Displays in timeline/dashboard views
- Calculates streaks and statistics

## 📊 Automation Ideas

- **VS Code Extension**: Auto-open today's report
- **GitHub Actions**: Auto-commit daily reports
- **Stats Generation**: Weekly/monthly summaries
- **Reminder System**: Daily notification to fill report
