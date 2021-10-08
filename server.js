const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.send('Hello World')
})
app.get('/webhook', function (req, res) {
  try {
    const data = [
      {
        name: "rungchai",
        age: 23
      },
      {
        name: "ball",
        age: 23
      }
    ]
    res.status(200).json(data);
  } catch (error) {
    console.log(error)
  }
})

app.listen(PORT, function () {
  console.log(`Start Server Port 3000`)
})