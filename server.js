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

  if (req.body.events[0].type === "message" && subMessage === "แจ้งซ่อม:" && req.body.events[0].message.type === "text") {

    const client = new line.Client({
      channelAccessToken: TOKEN
    });

    const dateTime = Date.now()
    const dateNow = new Date(dateTime)
    const dt = `${dateNow.getDate()}/${dateNow.getMonth()+1}/${dateNow.getFullYear()} ${dateNow.getHours()}:${dateNow.getMinutes}:${dateNow.getUTCMilliseconds}`
    
    const user = await client.getProfile(userID);
   
    // Message data, must be stringified
    const dataString = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [{
        "type": "text",
        "text": "รับเรื่องเรียบร้อยครับ"
      }]
    })

    let dataStringFlex = JSON.stringify({
      replyToken: req.body.events[0].replyToken,
      messages: [{
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "backgroundColor": "#EFE021FF",
          "contents": [
            {
              "type": "text",
              "text": "แจ้งซ่อม",
              "align": "center",
              "contents": []
            }
          ]
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
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
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
              "contents": [
                {
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
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
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
          "contents": [
            {
              "type": "spacer"
            }
          ]
        }
      }]
    })

    let testFlex = {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
        "size": "full",
        "aspectRatio": "20:13",
        "aspectMode": "cover",
        "action": {
          "type": "uri",
          "uri": "http://linecorp.com/"
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "Brown Cafe",
            "weight": "bold",
            "size": "xl"
          },
          {
            "type": "box",
            "layout": "baseline",
            "margin": "md",
            "contents": [
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png"
              },
              {
                "type": "icon",
                "size": "sm",
                "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png"
              },
              {
                "type": "text",
                "text": "4.0",
                "size": "sm",
                "color": "#999999",
                "margin": "md",
                "flex": 0
              }
            ]
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "lg",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Place",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Time",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": "10:00 - 23:00",
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 5
                  }
                ]
              }
            ]
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "CALL",
              "uri": "https://linecorp.com"
            }
          },
          {
            "type": "button",
            "style": "link",
            "height": "sm",
            "action": {
              "type": "uri",
              "label": "WEBSITE",
              "uri": "https://linecorp.com"
            }
          },
          {
            "type": "spacer",
            "size": "sm"
          }
        ],
        "flex": 0
      }
    }



    // Request header
    // const headers = {
    //   "Content-Type": "application/json",
    //   "Authorization": "Bearer " + TOKEN
    // }

    // // Options to pass into the request
    // const webhookOptions = {
    //   "hostname": "api.line.me",
    //   "path": "/v2/bot/message/reply",
    //   "method": "POST",
    //   "headers": headers,
    //   "body": dataStringFlex
    // }

    axios.post(URL_GOOGLE_SHEET, {
        id: `${messageID}`,
        message: `${payload}`,
        userID:`${userID}`,
        timestamp:`${dt}`
      })
      .then(function (response) {
        if (response.data === "success") {
          // // Define request
          // const request = https.request(webhookOptions, (res) => {
          //   res.on("data", (d) => {
          //     process.stdout.write(d)
          //   })
          // })

          // // Handle error
          // request.on("error", (err) => {
          //   console.error(err)
          // })

          // // Send data
          // request.write(dataStringFlex)
          // request.end()
          const message = {
            type: 'text',
            text: 'Hello World!'
          };
          
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