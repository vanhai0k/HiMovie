const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/HiMovie')
.catch((err) =>{
    console.log("Failed to connect");
    console.log(err);
})
.finally((xxx)=>{
    console.log("Connected");
    console.log(xxx);
})

module.exports = {mongoose}