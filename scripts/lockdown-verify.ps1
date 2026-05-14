# Engineering Lockdown Verification Script
Write-Host "Starting Final Integrity Check..." -ForegroundColor Cyan

# 1. Prisma Validation
Write-Host "[1/4] Validating Prisma Schema..." -ForegroundColor Yellow
npx prisma validate

# 2. Type Integrity
Write-Host "[2/4] Running Typecheck..." -ForegroundColor Yellow
npm run typecheck

# 3. Linting
Write-Host "[3/4] Running Linter..." -ForegroundColor Yellow
npm run lint

# 4. Build Verification
Write-Host "[4/4] Verifying Production Build..." -ForegroundColor Yellow
npm run build

Write-Host "Verification Complete. If all steps passed, the baseline is stable." -ForegroundColor Green
