const https = require("https")
const express = require("express")
const app = express()
const axios = require('axios');
require('dotenv').config()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN
const URL_GOOGLE_SHEET = process.env.URL_GOOGLE_SHEET
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendStatus(200)
})

app.post("/webhook", function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  let message = req.body.events[0].message.text
  let messageID = req.body.events[0].message.id
  let subMessage = message.slice(0, 10);
  let payload = message.slice(10);

  // if (req.body.events[0].type === "message") {
  //   // Message data, must be stringified
  //   const dataString = JSON.stringify({
  //     replyToken: req.body.events[0].replyToken,
  //     messages: [{
  //         "type": "text",
  //         "text": "Hello, user"
  //       },
  //       {
  //         "type": "text",
  //         "text": "May I help you?"
  //       }
  //     ]
  //   })

  //   // Request header
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "Authorization": "Bearer " + TOKEN
  //   }

  //   // Options to pass into the request
  //   const webhookOptions = {
  //     "hostname": "api.line.me",
  //     "path": "/v2/bot/message/reply",
  //     "method": "POST",
  //     "headers": headers,
  //     "body": dataString
  //   }

  //   // Define request
  //   const request = https.request(webhookOptions, (res) => {
  //     res.on("data", (d) => {
  //       process.stdout.write(d)
  //     })
  //   })

  //   // Handle error
  //   request.on("error", (err) => {
  //     console.error(err)
  //   })

  //   // Send data
  //   request.write(dataString)
  //   request.end()
  // }
console.log("test 1")
console.log(message)
console.log(req.body.events[0].message.type)
console.log(subMessage)
console.log(subMessage === "แจ้งซ่อม:")
  if (req.body.events[0].type === "message" && subMessage === "แจ้งซ่อม:" && req.body.events[0].message.type === "text") {
    console.log("test 2")
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [{
        "type": "text",
        "text": "รับเรื่องเรียบร้อยครับ"
      }]
    })

    // Request header
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + TOKEN
    }

    // Options to pass into the request
    const webhookOptions = {
      "hostname": "api.line.me",
      "path": "/v2/bot/message/reply",
      "method": "POST",
      "headers": headers,
      "body": dataString
    }

    axios.post(URL_GOOGLE_SHEET, {
        id: `${messageID}`,
        message: `${payload}`
      })
      .then(function (response) {
        console.log("test 3")
        if (response.data === "success") {
          console.log("test 4")
          // Define request
          const request = https.request(webhookOptions, (res) => {
            res.on("data", (d) => {
              process.stdout.write(d)
            })
          })

          // Handle error
          request.on("error", (err) => {
            console.error(err)
          })

          // Send data
          request.write(dataString)
          request.end()
        }
      })
      .catch(function (error) {
        console.log(error);
      });


  }
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})