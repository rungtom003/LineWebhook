const express = require('express')
const app = express()
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
}
app.use(middleware(config))


app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('/webhook', function (req, res) {
  try {
    res.json(req.body.events) // req.body will be webhook event object
  } catch (error) {
    console.log(error)
  }
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(PORT, function () {
  console.log(`Start Server http://localhost:${PORT}`)
})