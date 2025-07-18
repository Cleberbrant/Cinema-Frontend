@echo off
echo ============================================
echo DIAGNOSTICO DO SISTEMA CINEMA
echo ============================================
echo.

echo 🔍 Verificando se os backends estao rodando...
echo.

echo Testando Auth-Cinema (porta 8080):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8080/actuator/health 2>nul || echo "Erro: Nao foi possivel conectar"

echo Testando Cinema-Backend (porta 8081):
curl -s -o nul -w "Status: %%{http_code}\n" http://localhost:8081/actuator/health 2>nul || echo "Erro: Nao foi possivel conectar"

echo.
echo 🌐 Testando rotas especificas...
echo.

echo Testando rota de auth:
curl -s -o nul -w "Auth Route Status: %%{http_code}\n" http://localhost:8080/auth/test 2>nul || echo "Erro: Auth route nao acessivel"

echo Testando rota de API:
curl -s -o nul -w "API Route Status: %%{http_code}\n" http://localhost:8081/api/test 2>nul || echo "Erro: API route nao acessivel"

echo.
echo 🔧 Verificando arquivos de configuracao...
echo.

if exist "proxy.conf.json" (
    echo ✅ proxy.conf.json encontrado
) else (
    echo ❌ proxy.conf.json NAO encontrado
)

if exist "angular.json" (
    echo ✅ angular.json encontrado
    findstr "proxyConfig" angular.json >nul && echo ✅ Proxy configurado no angular.json || echo ❌ Proxy NAO configurado no angular.json
) else (
    echo ❌ angular.json NAO encontrado
)

echo.
echo 📋 INSTRUCOES:
echo.
echo 1. Certifique-se de que os backends estejam rodando:
echo    - Auth-Cinema na porta 8080
echo    - Cinema-Backend na porta 8081
echo.
echo 2. Inicie o frontend com proxy:
echo    ng serve --proxy-config proxy.conf.json --port 4300
echo.
echo 3. Se ainda houver erro de CORS, verifique se os backends
echo    tem CORS configurado para aceitar requisicoes de:
echo    http://localhost:4300
echo.
echo ============================================
