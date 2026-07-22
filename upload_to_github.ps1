# Script para subir la web a GitHub y activar GitHub Pages automaticamente
$ErrorActionPreference = 'Stop'

$toolsDir = Join-Path $PSScriptRoot "temp_tools"
$gitExe = Join-Path $toolsDir "git\cmd\git.exe"
$ghExe = Join-Path $toolsDir "gh\gh.exe"

if (-not (Test-Path $gitExe) -or -not (Test-Path $ghExe)) {
    throw "Por favor, corre primero download_tools.ps1 para preparar las herramientas."
}

# --- 1. CONFIGURACION E INICIALIZACION DE GIT ---
if (-not (Test-Path (Join-Path $PSScriptRoot ".git"))) {
    Write-Output "Inicializando repositorio Git local..."
    & $gitExe init -b main
    
    # Configurar nombre/email local por defecto si no estan configurados
    & $gitExe config user.name "ARC Villa Insuperable"
    & $gitExe config user.email "contacto@arcvillainsuperable.com"
}

# Agregar archivos y hacer primer commit
Write-Output "Agregando archivos a Git..."
& $gitExe add index.html styles.css script.js logo.jpg README.md
& $gitExe commit -m "Primer commit: Portafolio de ARC Villa Insuperable" | Out-Null 2>&1

# --- 2. AUTENTICACION CON GITHUB ---
Write-Output "Verificando autenticacion con GitHub..."

$isAuthenticated = $false
try {
    # Desactivamos temporalmente la detencion por errores de redireccion
    $oldEAP = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    
    $statusText = & $ghExe auth status 2>&1 | Out-String
    if ($statusText -like "*Logged in to github.com*") {
        $isAuthenticated = $true
    }
} catch {
    # Ignorar error, asumimos no autenticado
} finally {
    $ErrorActionPreference = $oldEAP
}

if ($isAuthenticated) {
    Write-Output "Ya estas autenticado en GitHub!"
} else {
    Write-Output "=========================================================="
    Write-Output "SE REQUIERE AUTENTICACION DE GITHUB"
    Write-Output "=========================================================="
    Write-Output "Se abrira tu navegador para iniciar sesion en GitHub."
    Write-Output "Copia el codigo de un solo uso que se mostrara en pantalla."
    Write-Output "=========================================================="
    
    # Iniciar login interactivo. gh mostrara el codigo y abrira el navegador de forma segura.
    & $ghExe auth login -h github.com -p https -w
}

# Verificar de nuevo si el login fue exitoso
$isAuthenticatedFinal = $false
try {
    $oldEAP = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    $statusText = & $ghExe auth status 2>&1 | Out-String
    if ($statusText -like "*Logged in to github.com*") {
        $isAuthenticatedFinal = $true
    }
} catch {} finally {
    $ErrorActionPreference = $oldEAP
}

if (-not $isAuthenticatedFinal) {
    throw "No se pudo verificar la sesion de GitHub. Por favor, intenta de nuevo."
}

# Obtener nombre de usuario
$username = (& $ghExe api user --jq .login).Trim()
Write-Output "Autenticado como: $username"

# --- 3. CREAR EL REPOSITORIO EN GITHUB ---
$repoName = "ARCVILLAINSUPERABLE"
Write-Output "Creando repositorio publico '$repoName' en GitHub..."

# Comprobar si el repositorio ya existe
$repoExists = $false
try {
    $oldEAP = $ErrorActionPreference
    $ErrorActionPreference = 'SilentlyContinue'
    $viewText = & $ghExe repo view "$username/$repoName" 2>&1 | Out-String
    if ($viewText -like "*$repoName*") {
        $repoExists = $true
    }
} catch {} finally {
    $ErrorActionPreference = $oldEAP
}

if (-not $repoExists) {
    # Crear y subir
    & $ghExe repo create $repoName --public --source=$PSScriptRoot --remote=origin --push
    Write-Output "Repositorio creado y subido con exito!"
} else {
    Write-Output "El repositorio '$repoName' ya existe en tu cuenta. Subiendo cambios a 'main'..."
    & $gitExe remote set-url origin "https://github.com/$username/$repoName.git" 2>$null
    & $gitExe push -u origin main --force
}

# --- 4. ACTIVAR GITHUB PAGES ---
Write-Output "Activando GitHub Pages en el repositorio..."
try {
    # Intentar habilitar Pages con la API
    $apiResult = & $ghExe api -X POST repos/$username/$repoName/pages -f build_type=legacy -F "source[branch]=main" -F "source[path]=/" 2>&1
    Write-Output "GitHub Pages configurado correctamente."
} catch {
    # Si ya estaba activo, la API puede dar error, controlamos eso
    if ($_ -match "already exists" -or $apiResult -match "already exists") {
        Write-Output "GitHub Pages ya estaba activo en este repositorio."
    } else {
        Write-Output "Nota: Hubo un aviso al configurar Pages. Es posible que debas verificarlo en la configuracion web del repositorio."
    }
}

Write-Output "=========================================================="
Write-Output "TODO LISTO!"
Write-Output "Tu sitio web se esta desplegando."
Write-Output "En unos minutos estara disponible en: https://$username.github.io/$repoName/"
Write-Output "=========================================================="
