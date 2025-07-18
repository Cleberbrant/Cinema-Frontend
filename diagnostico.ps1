# Script de diagnóstico para o sistema Cinema
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "DIAGNOSTICO DO SISTEMA CINEMA" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Verificando se os backends estao rodando..." -ForegroundColor Yellow
Write-Host ""

function Test-Backend {
    param(
        [string]$Url,
        [string]$Name
    )

    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ $Name : Status $($response.StatusCode)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $Name : Erro - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Testando backends
$auth = Test-Backend "http://localhost:8080/actuator/health" "Auth-Cinema (8080)"
$api = Test-Backend "http://localhost:8081/actuator/health" "Cinema-Backend (8081)"

Write-Host ""
Write-Host "Testando rotas especificas..." -ForegroundColor Yellow
Write-Host ""

Test-Backend "http://localhost:8080/auth/test" "Auth Route Test"
Test-Backend "http://localhost:8081/api/test" "API Route Test"

Write-Host ""
Write-Host "Verificando arquivos de configuracao..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path "proxy.conf.json") {
    Write-Host "✅ proxy.conf.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ proxy.conf.json NAO encontrado" -ForegroundColor Red
}

if (Test-Path "angular.json") {
    Write-Host "✅ angular.json encontrado" -ForegroundColor Green
    $content = Get-Content "angular.json" -Raw
    if ($content -match "proxyConfig") {
        Write-Host "✅ Proxy configurado no angular.json" -ForegroundColor Green
    } else {
        Write-Host "❌ Proxy NAO configurado no angular.json" -ForegroundColor Red
    }
} else {
    Write-Host "❌ angular.json NAO encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "INSTRUCOES:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Certifique-se de que os backends estejam rodando:" -ForegroundColor White
Write-Host "   - Auth-Cinema na porta 8080" -ForegroundColor Gray
Write-Host "   - Cinema-Backend na porta 8081" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Inicie o frontend com proxy:" -ForegroundColor White
Write-Host "   ng serve --proxy-config proxy.conf.json --port 4300" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Se ainda houver erro de CORS, verifique se os backends" -ForegroundColor White
Write-Host "   tem CORS configurado para aceitar requisicoes de:" -ForegroundColor White
Write-Host "   http://localhost:4300" -ForegroundColor Gray
Write-Host ""

if (!$auth -or !$api) {
    Write-Host "ATENCAO: Um ou mais backends nao estao respondendo!" -ForegroundColor Yellow
    Write-Host "Certifique-se de iniciar os backends antes do frontend." -ForegroundColor Yellow
}

Write-Host "============================================" -ForegroundColor Cyan
