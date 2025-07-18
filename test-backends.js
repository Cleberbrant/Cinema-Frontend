#!/usr/bin/env node

const http = require("http");

function testEndpoint(host, port, path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: "GET",
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      console.log(
        `✅ ${name}: Status ${res.statusCode} - ${res.statusMessage}`
      );
      resolve(true);
    });

    req.on("error", (err) => {
      console.log(`❌ ${name}: Error - ${err.message}`);
      resolve(false);
    });

    req.on("timeout", () => {
      console.log(`⏰ ${name}: Timeout`);
      resolve(false);
    });

    req.end();
  });
}

async function testBackends() {
  console.log("🔍 Testando conectividade dos backends...\n");

  await testEndpoint(
    "localhost",
    8080,
    "/actuator/health",
    "Auth-Cinema (8080)"
  );
  await testEndpoint(
    "localhost",
    8081,
    "/actuator/health",
    "Cinema-Backend (8081)"
  );

  console.log("\n🧪 Testando rotas específicas...\n");

  await testEndpoint("localhost", 8080, "/auth/test", "Auth Route Test");
  await testEndpoint("localhost", 8081, "/api/test", "API Route Test");
}

testBackends();
