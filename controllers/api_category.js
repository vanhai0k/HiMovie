const CateModel = require('../models/Movie.models')

exports.getCategory = async (req,res) =>{
    try {
        const list = await CateModel.categoryMovie.find();
        res.json(list);
    } catch (error) {
        console.log("fale",error.message);
    }
}