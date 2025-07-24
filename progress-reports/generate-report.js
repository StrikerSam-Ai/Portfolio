#!/usr/bin/env node

/**
 * Daily Progress Report Generator
 * Usage: node generate-report.js [quick]
 */

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
  const month = String(today.getMonth() + 1).padStart(2, '0');
  
  // Calculate day number (adjust this based on your start date)
  const startDate = new Date('2024-01-01'); // Adjust to your journey start
  const dayNumber = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  
  // Choose template
  const templateName = isQuick ? 'quick-template.md' : 'daily-template.md';
  const templatePath = path.join(__dirname, 'templates', templateName);
  
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templatePath}`);
    return;
  }
  
  // Read template
  let template = fs.readFileSync(templatePath, 'utf8');
  
  // Replace placeholders
  template = template.replace(/{DAY_NUMBER}/g, dayNumber);
  template = template.replace(/{DATE}/g, today.toLocaleDateString());
  template = template.replace(/{YYYY-MM-DD}/g, dateStr);
  template = template.replace(/{current_date}/g, today.toLocaleString());
  template = template.replace(/{TITLE}/g, 'Add Your Title Here');
  
  // Ensure year directory exists
  const yearDir = path.join(__dirname, year.toString());
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
  }
  
  // Create filename
  const filename = `day-${String(dayNumber).padStart(3, '0')}-${dateStr}.md`;
  const filepath = path.join(yearDir, filename);
  
  // Check if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`📝 Report already exists: ${filename}`);
    console.log(`📂 Opening: ${filepath}`);
    
    // Try to open in VS Code (Windows)
    exec(`code "${filepath}"`, (error) => {
      if (error) {
        console.log(`💡 Manually open: ${filepath}`);
      }
    });
    return;
  }
  
  // Write new report
  fs.writeFileSync(filepath, template);
  console.log(`✅ Created new ${isQuick ? 'quick ' : ''}report: ${filename}`);
  console.log(`📂 Location: ${filepath}`);
  
  // Try to open in VS Code
  exec(`code "${filepath}"`, (error) => {
    if (error) {
      console.log(`💡 Manually open: ${filepath}`);
    }
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
const isQuick = args.includes('quick') || args.includes('-q');

generateReport(isQuick);
