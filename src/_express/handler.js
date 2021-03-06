const fs = require('fs')
const awsServerlessExpress = require('aws-serverless-express')

exports.handler = async (event, context) => {
  // make event object look like APIG 1.0
  // until aws-serverless-express supports APIG 2.0
  event.path = event.requestContext.http.path
  event.method = event.requestContext.http.method

  // NOTICE: require() is relative to this file, while existsSync() is relative to the cwd, which is the root of lambda
  let app
  if (fs.existsSync('./app.js')) {
    // load the user provided app
    app = require('../app.js')
  } else {
    // load the built-in default app
    app = require('../_src/app.js')
  }

  const server = awsServerlessExpress.createServer(app)
  const res = await awsServerlessExpress.proxy(server, event, context, 'PROMISE')
  return res.promise
}
