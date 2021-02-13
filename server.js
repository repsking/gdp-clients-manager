const http = require ('http');
const app = require('./app');

const getPort = () => {
  const DEFAULT_PORT = 3000;
  const envPort = process.env.PORT && parseInt(process.env.PORT);
  return !isNaN(envPort) && envPort || DEFAULT_PORT;
} 

const port = getPort();
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
    default:
      throw error;
  }
};

const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log(`Server working on ${bind}`);
});

server.listen(port);
