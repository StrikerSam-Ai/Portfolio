# Daily Progress Report Generator (PowerShell)
# Usage: .\new-report.ps1 [-Quick]

param(
    [switch]$Quick
)

# Configuration
$StartDate = Get-Date "2024-01-01"  # Adjust to your journey start
$Today = Get-Date
$DateStr = $Today.ToString("yyyy-MM-dd")
$Year = $Today.Year
$DayNumber = ($Today - $StartDate).Days + 1

# Choose template
$TemplateName = if ($Quick) { "quick-template.md" } else { "daily-template.md" }
$TemplatePath = Join-Path $PSScriptRoot "templates\$TemplateName"

if (-not (Test-Path $TemplatePath)) {
    Write-Error "Template not found: $TemplatePath"
    exit 1
}

# Read template
$Template = Get-Content $TemplatePath -Raw

# Replace placeholders
$Template = $Template -replace '\{DAY_NUMBER\}', $DayNumber
$Template = $Template -replace '\{DATE\}', $Today.ToShortDateString()
$Template = $Template -replace '\{YYYY-MM-DD\}', $DateStr
$Template = $Template -replace '\{current_date\}', $Today.ToString()
$Template = $Template -replace '\{TITLE\}', 'Add Your Title Here'

# Ensure year directory exists
$YearDir = Join-Path $PSScriptRoot $Year
if (-not (Test-Path $YearDir)) {
    New-Item -ItemType Directory -Path $YearDir -Force | Out-Null
}

# Create filename
$DayStr = $DayNumber.ToString().PadLeft(3, '0')
$Filename = "day-$DayStr-$DateStr.md"
$Filepath = Join-Path $YearDir $Filename

# Check if file already exists
if (Test-Path $Filepath) {
    Write-Host "📝 Report already exists: $Filename" -ForegroundColor Yellow
    Write-Host "📂 Opening: $Filepath" -ForegroundColor Cyan
    
    # Open in VS Code
    try {
        & code $Filepath
    } catch {
        Write-Host "💡 Manually open: $Filepath" -ForegroundColor Green
    }
    exit 0
}

# Write new report
Set-Content -Path $Filepath -Value $Template

Write-Host "✅ Created new $(if($Quick){'quick '}else{''})report: $Filename" -ForegroundColor Green
Write-Host "📂 Location: $Filepath" -ForegroundColor Cyan

# Open in VS Code
try {
    & code $Filepath
} catch {
    Write-Host "💡 Manually open: $Filepath" -ForegroundColor Green
}
