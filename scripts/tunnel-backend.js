
const localtunnel = require('localtunnel');
const { exec } = require('child_process');

(async () => {
  const port = 8000;
  const tunnel = await localtunnel({ port });

  console.log(`🚀 Backend Tunnel active at: ${tunnel.url}`);

  tunnel.on('close', () => {
    console.log('❌ Tunnel closed');
  });

  // Keep process alive
  process.on('SIGINT', () => {
    tunnel.close();
    process.exit();
  });
})();
