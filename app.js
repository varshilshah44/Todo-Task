const express = require('express');
const app = express();
const indexRouter = require('./routes/index');

app.use(express.static('public'))
app.use('/',indexRouter);

app.listen(3000,()=>{
    console.log("running")
});