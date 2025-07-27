import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateReport(isQuick = false) {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const year = today.getFullYear();
  
  // Calculate day number from your actual start date
  const startDate = new Date('2025-07-24');
  const dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
  console.log('Generating Day', dayNumber, 'report...');
  
  // Choose template
  const templateName = isQuick ? 'quick-template.md' : 'daily-template.md';
  const templatePath = path.join(__dirname, 'templates', templateName);
  
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found:', templatePath);
    return;
  }
  
  // Read template
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace placeholders
  template = template.replace(/{DAY_NUMBER}/g, dayNumber);
  template = template.replace(/{DATE}/g, today.toLocaleDateString());
  template = template.replace(/{YYYY-MM-DD}/g, dateStr);
  template = template.replace(/{current_date}/g, today.toLocaleString());
  
  // Since script is in public/progress-reports/, create year folder here
  const yearDir = path.join(__dirname, year.toString());
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
  }
  
  // Create filename
  const filename = 'day-' + String(dayNumber).padStart(3, '0') + '-' + dateStr + '.md';
  const filepath = path.join(yearDir, filename);
  
  // Check if file already exists
  if (fs.existsSync(filepath)) {
    console.log('Report already exists:', filename);
    return;
  }
  
  // Write new report
  fs.writeFileSync(filepath, template);
  console.log('✅ Created new report:', filename);
  console.log('📂 Location:', filepath);
}

const args = process.argv.slice(2);
const isQuick = args.includes('quick');
generateReport(isQuick);