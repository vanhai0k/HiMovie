var db = require("./db");

const userSchema = new db.mongoose.Schema({
    name: {type: String},
    email: {type: String},
    password: {type: String},
    phone: {type: String},
    roles: {type: String},
}, {
    collection: 'users',
})

let userModel = db.mongoose.model('userModel', userSchema);

module.exports= {
    userModel,
}