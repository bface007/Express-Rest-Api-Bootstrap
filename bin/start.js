/**
 * Created by bface007 on 30/04/2017.
 */
const cluster = require('cluster'),
      debug = require('debug')('master'),
      stopSignals = [
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
      ],
      production = process.env.NODE_ENV === 'production';

let stopping = false;

cluster.on('disconnect', function(worker) {
  if (production) {
    if (!stopping) {
      cluster.fork();
    }
  } else {
    process.exit(1);
  }
});

if (cluster.isMaster) {
  const workerCount = process.env.NODE_CLUSTER_WORKERS || 4;
  debug(`Starting ${workerCount} workers...`);
  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }
  if (production) {
    stopSignals.forEach(function (signal) {
      process.on(signal, function () {
        debug(`Got ${signal}, stopping workers...`);
        stopping = true;
        cluster.disconnect(function () {
          debug('All workers stopped, exiting.');
          process.exit(0);
        });
      });
    });
  }
} else {
  require('../server');
}
