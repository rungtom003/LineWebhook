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

app.post("/webhook", async function (req, res) {
  res.send("HTTP POST request sent to the webhook URL!")
  // If the user sends a message to your bot, send a reply message
  let message = req.body.events[0].message.text
  let messageID = req.body.events[0].message.id
  let userID = req.body.events[0].source.userId
  let dt = req.body.events[0].timestamp

  let subMessage = message.slice(0, 9);
  let vavel = message.search("ระดับ:");
  let vavelSub = message.slice(vavel, vavel + 6)
  let payload = message.slice(9,vavel);
  let payloadvavel = message.slice(vavel + 6);


  if (req.body.events[0].type === "message" && subMessage === "แจ้งซ่อม:" && req.body.events[0].message.type === "text") {

    const client = new line.Client({
      channelAccessToken: TOKEN
    });

    const dateTime = Date.now()
    const dateNow = new Date(dateTime)
    const dt = `${dateNow.getDate()}/${dateNow.getMonth()+1}/${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getUTCMilliseconds()}`

    const user = await client.getProfile(userID);

    const pic1 = "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
    const pic2 = "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"

    let pic = []

    for (let i = 1; i <= 5; i++) {
      if (Number(payloadvavel) >= i) {
        pic.push(pic1)
      } else {
        pic.push(pic2)
      }
    }

    if(vavel < 0)
    {
      payload = message.slice(9);
    }

    let level = {
      "type": "box",
      "layout": "baseline",
      "contents": [{
          "type": "text",
          "text": "ระดับความด่วน : ",
          "weight": "bold",
          "color": "#888888",
          "align": "start",
          "gravity": "top",
          "position": "relative",
          "contents": []
        },
        {
          "type": "icon",
          "url": pic[0],
          "size": "sm",
          "position": "relative",
          "offsetEnd": "25%"
        },
        {
          "type": "icon",
          "url": pic[1],
          "size": "sm",
          "position": "relative",
          "offsetEnd": "25%"
        },
        {
          "type": "icon",
          "url": pic[2],
          "size": "sm",
          "offsetEnd": "25%"
        },
        {
          "type": "icon",
          "url": pic[3],
          "size": "sm",
          "offsetEnd": "25%"
        },
        {
          "type": "icon",
          "url": pic[4],
          "size": "sm",
          "offsetEnd": "25%"
        }
      ]
    }

    let message = {
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "backgroundColor": "#EFE021FF",
          "contents": [{
            "type": "text",
            "text": "รับการแจ้งซ่อมสำเร็จ",
            "align": "center",
            "contents": []
          }]
        },
        "hero": {
          "type": "image",
          "url": user.pictureUrl,
          "size": "5xl",
          "aspectRatio": "1.51:1",
          "aspectMode": "fit",
          "offsetTop": "10%"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "paddingTop": "10%",
          "contents": [{
              "type": "box",
              "layout": "horizontal",
              "contents": [{
                  "type": "text",
                  "text": "ชื่อผู้แจ้ง : ",
                  "weight": "bold",
                  "color": "#888888",
                  "align": "start",
                  "gravity": "top",
                  "contents": []
                },
                {
                  "type": "text",
                  "text": user.displayName,
                  "position": "relative",
                  "offsetEnd": "20%",
                  "contents": []
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [{
                  "type": "text",
                  "text": "วันเวลา : ",
                  "weight": "bold",
                  "color": "#888888",
                  "align": "start",
                  "gravity": "top",
                  "contents": []
                },
                {
                  "type": "text",
                  "text": dt,
                  "weight": "regular",
                  "align": "start",
                  "gravity": "top",
                  "wrap": true,
                  "position": "relative",
                  "offsetEnd": "20%",
                  "contents": []
                }
              ]
            },
            level,
            {
              "type": "box",
              "layout": "vertical",
              "contents": [{
                  "type": "text",
                  "text": "รายละเอียดการเเจ้งซ่อม",
                  "weight": "bold",
                  "color": "#888888",
                  "align": "start",
                  "gravity": "top",
                  "contents": []
                },
                {
                  "type": "text",
                  "text": payload,
                  "weight": "regular",
                  "align": "start",
                  "gravity": "center",
                  "wrap": true,
                  "contents": []
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "backgroundColor": "#F6B81AFF",
          "contents": [{
            "type": "spacer"
          }]
        }
      }
    }

    axios.post(URL_GOOGLE_SHEET, {
        id: `${messageID}`,
        message: `${payload}`,
        userID: `${userID}`,
        timestamp: `${dt}`
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