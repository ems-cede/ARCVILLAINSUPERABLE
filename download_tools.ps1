# Script para descargar herramientas portables de Git y GitHub CLI (gh)
$ErrorActionPreference = 'Stop'

$toolsDir = Join-Path $PSScriptRoot "temp_tools"
if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir | Out-Null
}

# --- 1. DESCARGAR MINGIT ---
Write-Output "Obteniendo versión más reciente de MinGit..."
$latestTag = (Invoke-RestMethod -Uri "https://gitforwindows.org/latest-tag.txt").Trim()
$latestVer = (Invoke-RestMethod -Uri "https://gitforwindows.org/latest-version.txt").Trim()
$minGitUrl = "https://github.com/git-for-windows/git/releases/download/$latestTag/MinGit-$latestVer-64-bit.zip"
$minGitZip = Join-Path $toolsDir "mingit.zip"
$gitDest = Join-Path $toolsDir "git"

if (-not (Test-Path $gitDest)) {
    Write-Output "Descargando MinGit desde $minGitUrl..."
    Invoke-WebRequest -Uri $minGitUrl -OutFile $minGitZip
    
    Write-Output "Extrayendo MinGit..."
    Expand-Archive -Path $minGitZip -DestinationPath $gitDest
    Remove-Item $minGitZip
    Write-Output "MinGit instalado correctamente en $gitDest"
} else {
    Write-Output "MinGit ya está listo."
}

# --- 2. DESCARGAR GITHUB CLI (gh) ---
Write-Output "Obteniendo versión más reciente de GitHub CLI..."
$ghRelease = Invoke-RestMethod -Uri "https://api.github.com/repos/cli/cli/releases/latest"
$ghAsset = $ghRelease.assets | Where-Object { $_.name -like "*_windows_amd64.zip" } | Select-Object -First 1

if (-not $ghAsset) {
    throw "No se pudo encontrar el archivo ZIP de GitHub CLI en los assets de la versión más reciente."
}

$ghUrl = $ghAsset.browser_download_url
$ghZip = Join-Path $toolsDir "gh.zip"
$ghDest = Join-Path $toolsDir "gh"

if (-not (Test-Path $ghDest)) {
    Write-Output "Descargando GitHub CLI desde $ghUrl..."
    Invoke-WebRequest -Uri $ghUrl -OutFile $ghZip
    
    Write-Output "Extrayendo GitHub CLI..."
    Expand-Archive -Path $ghZip -DestinationPath $ghDest
    Remove-Item $ghZip
    
    # Acomodar archivos: gh se extrae dentro de una subcarpeta, la buscamos y movemos su contenido
    $subDir = Get-ChildItem -Path $ghDest -Directory | Select-Object -First 1
    if ($subDir) {
        $files = Get-ChildItem -Path $subDir.FullName
        foreach ($file in $files) {
            Move-Item -Path $file.FullName -Destination $ghDest -Force
        }
        Remove-Item $subDir.FullName -Recurse -Force
    }
    Write-Output "GitHub CLI instalado correctamente en $ghDest"
} else {
    Write-Output "GitHub CLI ya está listo."
}

Write-Output "=== Herramientas preparadas con éxito ==="
