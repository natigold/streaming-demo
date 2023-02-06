'use strict';

import log4js from 'log4js';

const logger = () => {
  var logDir = process.env.NODE_LOG_DIR !== undefined ? process.env.NODE_LOG_DIR : '.';

  var config = {
    appenders: {
      default: {
        "type": "file",
        "filename": logDir + "/" + "application.log",
        "pattern": "-yyyy-MM-dd",
        "layout": {
          "type": "pattern",
          "pattern": "%d (PID: %x{pid}) %p %c - %m",
          "tokens": {
            "pid": function () { return process.pid; }
          }
        }
      },
    },
    categories: {
      default: { appenders: ['default'], level: 'info' },
    }
  };

  log4js.configure(config, {});

  return {
    getLogger: function (category) {
      // return log4js.getLogger(category);
      return console;
    }
  };
};

export { logger };