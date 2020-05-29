const express = require('express')
const PORT = process.env.PORT || 5000

// Init app
app = express()

// Testing
app.get('/', (req,res) => {
    res.send('Hello World')
})


// Listen 
app.listen(PORT, () =>{
    console.log('Server started');
})