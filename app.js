const express = require('express');
const app = express();
const indexRouter = require('./routes/index');

app.use(express.static('public'))
app.use('/',indexRouter);

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("running")
});