# 🚨 PROBLEMA IDENTIFICADO E SOLUÇÕES

## Diagnóstico

Os backends estão rodando, mas há problemas de configuração:

### Auth-Cinema (porta 8080)

- **Status**: Erro 403 Forbidden em todas as rotas
- **Problema**: Configuração de CORS ou Spring Security muito restritiva

### Cinema-Backend (porta 8081)

- **Status**: Erro 401 Unauthorized
- **Problema**: Todas as rotas estão protegidas por autenticação JWT

## ✅ SOLUÇÕES PARA OS BACKENDS

### 1. Auth-Cinema - Configuração CORS

Adicione/ajuste no seu `Auth-Cinema`:

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/register", "/auth/login", "/actuator/**").permitAll()
                .anyRequest().authenticated()
            )
            .build();
    }
}
```

### 2. Cinema-Backend - Liberação de rotas públicas

No seu `Cinema-Backend`:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/**", "/api/filmes", "/api/cinemas").permitAll()
                .anyRequest().authenticated()
            )
            .build();
    }
}
```

### 3. Application.properties - CORS Headers

Adicione em ambos os backends:

```properties
# CORS Configuration
server.servlet.context-path=/
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always

# Para Auth-Cinema (application.properties)
spring.web.cors.allowed-origins=http://localhost:4200,http://localhost:4300
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

## 🔧 TESTE RÁPIDO

Após ajustar os backends, teste:

```bash
# Teste Auth-Cinema
curl http://localhost:8080/auth/register -H "Content-Type: application/json" -d '{"email":"teste@teste.com","senha":"123456","nome":"Teste"}'

# Teste Cinema-Backend (rota pública)
curl http://localhost:8081/api/filmes
```

## 🚀 EXECUTAR O FRONTEND

Após corrigir os backends:

```bash
# No diretório do frontend
ng serve --proxy-config proxy.conf.json --port 4300
```

Acesse: http://localhost:4300

## 📋 CHECKLIST

- [ ] Auth-Cinema configurado com CORS
- [ ] Auth-Cinema com rotas /auth/register e /auth/login públicas
- [ ] Cinema-Backend com CORS configurado
- [ ] Cinema-Backend com algumas rotas públicas (ex: /api/filmes)
- [ ] Frontend rodando com proxy na porta 4300
- [ ] Teste de registro funcionando
- [ ] Teste de login funcionando

## 🐛 Se ainda houver problemas

1. Verifique os logs dos backends ao tentar fazer login
2. Use F12 (DevTools) no navegador para ver detalhes do erro
3. Execute novamente: `powershell -ExecutionPolicy Bypass -File diagnostico.ps1`
