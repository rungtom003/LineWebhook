const https = require("https")
const express = require("express")
const app = express()
const axios = require('axios');
require('dotenv').config()
const line = require('@line/bot-sdk');
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

app.post("/webhook",async function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  let message = req.body.events[0].message.text
  let messageID = req.body.events[0].message.id
  let userID = req.body.events[0].source.userId
  let dt = req.body.events[0].timestamp
  let subMessage = message.slice(0, 9);
  let payload = message.slice(9);

  if (req.body.events[0].type === "message" && subMessage === "แจ้งซ่อม:" && req.body.events[0].message.type === "text") {

    const client = new line.Client({
      channelAccessToken: TOKEN
    });

    const dateTime = Date.now()
    const dateNow = new Date(dateTime)
    const dt = `${dateNow.getDate()}/${dateNow.getMonth()+1}/${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes}:${dateNow.getUTCMilliseconds}`
    
    const user = await client.getProfile(userID);

    let message = {
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "hello"
            },
            {
              "type": "text",
              "text": "world"
            }
          ]
        }
      }
    }
    
    

    axios.post(URL_GOOGLE_SHEET, {
        id: `${messageID}`,
        message: `${payload}`,
        userID:`${userID}`,
        timestamp:`${dt}`
      })
      .then(function (response) {
        if (response.data === "success") {

          // const message = {
          //   "type": "text",
          //   "text": "รับเรื่องเรียบร้อยครับ"
          // };
          
          client.replyMessage(req.body.events[0].replyToken, message)
            .then(() => {
              console.log("send success")
            })
            .catch((err) => {
              console.log(err)
            });
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