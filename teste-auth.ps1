# Script para testar autenticação após corrigir backends
Write-Host "🧪 TESTE DE AUTENTICACAO" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Content-Type" = "application/json"
}

# Teste 1: Registro
Write-Host "1. Testando registro..." -ForegroundColor Yellow
$registerData = @{
    nome = "Usuario Teste"
    email = "teste@teste.com"
    senha = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/register" -Method POST -Body $registerData -Headers $headers -UseBasicParsing
    Write-Host "✅ Registro: Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Registro falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 2: Login
Write-Host "2. Testando login..." -ForegroundColor Yellow
$loginData = @{
    email = "teste@teste.com"
    senha = "123456"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/auth/login" -Method POST -Body $loginData -Headers $headers -UseBasicParsing
    Write-Host "✅ Login: Status $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray

    # Extrair token para próximos testes
    $responseObj = $response.Content | ConvertFrom-Json
    if ($responseObj.token) {
        $token = $responseObj.token
        Write-Host "🔑 Token extraído com sucesso" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Login falhou: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Teste 3: Rota protegida (se tiver token)
if ($token) {
    Write-Host "3. Testando rota protegida..." -ForegroundColor Yellow
    $authHeaders = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8081/api/filmes" -Headers $authHeaders -UseBasicParsing
        Write-Host "✅ API protegida: Status $($response.StatusCode)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ API protegida falhou: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "1. Se os testes acima funcionaram, inicie o frontend:" -ForegroundColor White
Write-Host "   ng serve --proxy-config proxy.conf.json --port 4300" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Acesse http://localhost:4300 e teste login/registro" -ForegroundColor White
Write-Host ""
Write-Host "3. Se ainda houver erro, verifique as configurações em SOLUCAO-CORS.md" -ForegroundColor White
