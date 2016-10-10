var express    = require('express');
var bodyParser = require('body-parser');
var logger = require('./src/lib/log').init('debug');

var api        = require('./src/routes');
app            = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

app.use('/api', api);


if (process.NODE_ENV !== 'test') {
  // START THE SERVER
  app.listen(port);
  logger.info("start server, listen on port: %s", port);
}

exports = module.exports = app;
