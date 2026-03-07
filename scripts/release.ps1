# release.ps1 - Cache Busting Script for Malerweg 2026
# Run this script before uploading your files to the web server.
# It updates the version parameter (?v=...) in all HTML files to force browsers to reload CSS and JS.

$version = Get-Date -Format "yyyyMMddHHmm"
$siteDir = "site"

Write-Host "Updating assets to version: $version" -ForegroundColor Cyan

# Files to process
$htmlFiles = Get-ChildItem -Path $siteDir -Filter *.html -Recurse

foreach ($file in $htmlFiles) {
    Write-Host "Processing $($file.Name)..."
    $content = Get-Content $file.FullName -Raw

    # 1. Update existing ?v= parameters
    # Matches: href="...css?v=123" or src="...js?v=123"
    $content = [regex]::Replace($content, '(\.(css|js))\?v=[^"''\s>]+', '$1?v=' + $version)

    # 2. Add ?v= parameter to assets that don't have it yet
    # Target common local asset paths (assets/css/ or assets/js/)
    # This avoids adding versions to CDN links like unpkg.com
    $content = [regex]::Replace($content, '(href|src)="((assets/(css|js)/[^"''\?]+))"', '$1="$2?v=' + $version + '"')

    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Done! You can now upload the contents of the 'site' folder." -ForegroundColor Green
