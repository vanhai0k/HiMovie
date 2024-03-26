const bcrypt = require('bcrypt');
const MyModel = require('../models/Movie.models')

exports.registerUser = async (req, res, next) => {
    const {
        name,email,
        phone,roles,password,
    } = req.body;

    const existingName = await MyModel.userModel.findOne({name});
    const existingEmail = await MyModel.userModel.findOne({email});
    const existingPhone = await MyModel.userModel.findOne({phone});

    if(existingName){
        return res.status(409).json({message: "name da ton tai"});
    }
    if(existingEmail){
        return res.status(403).json({message: "email da ton tai" });
    }
    if(existingPhone){
        return res.status(404).json({message: "phone da ton tai" });
    }

    const hasPassword = await bcrypt.hash(password,10);
    const newPerson = new MyModel.userModel({
        name,email,password: hasPassword,roles: "user", phone
    });
    newPerson.save().then((err)=>{
        res.status(201).json({message: "Dang ky thanh cong"});
    })
    .catch((error)=>{
        console.log(error.message);
        res.status(500).json({message: "Fail"});
    })
}
exports.login = async (req, res) => {
    try {
        const {name, password} = req.body;

        const user = await MyModel.userModel.findOne({name});
        if(!user){
            return res.status(404).json({message:"Nguoi dung khong ton tai"});
        }
        // phan tich password : middlware
        const isPasswordVaild = await bcrypt.compare(password, user.password);
        if(!isPasswordVaild){
            return res.status(403).json({message:"Mat khau chua chinh xac"});
        }
        res.status(201).json({message:"Login thanh cong",
        // lay du lieu nguoi dung login
        name: user.name,
        password: user.password,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
        _id: user._id,
    });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: "Fail"});
    }
}
exports.updateUser = async (req, res) => {
    const iduser = req.params.iduser;
    const { name, email, phone } = req.body;
    
    // Kiểm tra dữ liệu đầu vào
    if (!name || !email || !phone) {
        return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ thông tin người dùng" });
    }
    
    try {
        // Cập nhật thông tin người dùng trong cơ sở dữ liệu
        const updatedUser = await MyModel.userModel.findByIdAndUpdate(
            iduser, 
            { name, email, phone }, 
            { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // Trả về phản hồi thành công với thông tin người dùng đã cập nhật
        res.status(200).json({ message: "Cập nhật thông tin người dùng thành công", updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
}

