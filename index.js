const express = require('express');
const app = express();
const port = process.env.PORT || 5000;



app.get('/', (req, res) => {
    res.send('Volunteer Network server running!!')
});

app.listen(port, () => {
    console.log(`Volunteer network app listening on port ${port}`)
});