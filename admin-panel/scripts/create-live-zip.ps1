$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "[1/5] Frontend build aliniyor..."
npm run build --workspace frontend

$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$releaseRoot = Join-Path $root "release"
$packageName = "admin-panel-live-$stamp"
$stage = Join-Path $releaseRoot $packageName
$zipPath = Join-Path $releaseRoot "$packageName.zip"

Write-Host "[2/5] Paket klasoru hazirlaniyor..."
if (Test-Path $stage) {
  Remove-Item -Path $stage -Recurse -Force
}
New-Item -Path $stage -ItemType Directory -Force | Out-Null

Write-Host "[3/5] Dosyalar kopyalaniyor..."
Copy-Item "package.json" -Destination $stage
Copy-Item "README.md" -Destination $stage
Copy-Item "backend" -Destination $stage -Recurse
Copy-Item "frontend" -Destination $stage -Recurse

Write-Host "[4/5] Hassas/agir dosyalar temizleniyor..."
Get-ChildItem -Path $stage -Recurse -Directory -Filter "node_modules" | Remove-Item -Recurse -Force
Get-ChildItem -Path $stage -Recurse -File -Filter ".env" | Remove-Item -Force

if (Test-Path $zipPath) {
  Remove-Item $zipPath -Force
}

Write-Host "[5/5] ZIP olusturuluyor..."
Compress-Archive -Path (Join-Path $stage "*") -DestinationPath $zipPath -CompressionLevel Optimal

Write-Host ""
Write-Host "Hazir: $zipPath"
Write-Host ""
