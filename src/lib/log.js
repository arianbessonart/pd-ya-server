var logger = require('winston');

function init(level) {
  level = level || 'info';
  logger.level = level;
  logger.setLevels({
    error: 0,
    warn: 1,
    silly: 2,
    info: 3,
    debug: 4
  });

  logger.addColors({
    debug: 'green',
    info:  'cyan',
    silly: 'magenta',
    warn:  'yellow',
    error: 'red'
  });

  logger.remove(logger.transports.Console);
  logger.add(logger.transports.Console,
    {
      level: level,
      colorize: true,
      timestamp: true
    }
  );
  return logger;
}

function getLogger() {
  return logger;
}

module.exports = {
  init: init,
  getLogger: getLogger
}
