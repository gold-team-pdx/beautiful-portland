const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Console.log to show server up and running in terminal
app.listen(port, () => console.log('Listening on port ' + port + '...'))

// Practice GET request to test server
app.get('/beautifulportland', (req,res) => {
    res.send({express: "The force is strong with this team..."})
})
