const adminModel = require('../model/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');


const loadLogin = async (req,res) =>{
    res.render('admin/login');
}

const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const admin = await adminModel.findOne({email});
        if(!admin) return res.render('admin/login', {message:"Invalid username or password"});
        const isMatch = await bcrypt.compare(password, admin.password);
        if(!isMatch) return res.render('admin/login', {message:"Invalid username or password"})
        req.session.admin = true;
        res.redirect ('/admin/Dashboard')
    }catch(error){
        res.send(error);
    }
}

const loadDashboard = async (req,res) =>{
    try{
        const admin = req.session.admin
        if(!admin) return res.redirect('/admin/login');

        const users = await userModel.find({});
        res.render('admin/Dashboard', {users}); 

    }catch(error){

    }
}

const editUser = async (req,res) =>{
   try{
    const {email,password,id} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(email)
    const user = await userModel.findOneAndUpdate({_id:id},
        {$set:{email,password:hashedPassword}}
    )

    
    console.log(user);

    res.redirect('/admin/Dashboard');
    
   } catch(error){
    console.log(error);
    
   }
}

const deleteUser = async (req,res) =>{
    try{
        const {id} = req.params;
        const user = await userModel.findOneAndDelete({_id:id})

        res.redirect('/admin/Dashboard');
    }catch(error){
        console.log(error);
    }
}

const addUser = async (req,res) =>{
    try{
        const {email,password} = req.body;
        const newUser = new userModel({
            email,
            password
        })
        await newUser.save();

        res.redirect('/admin/Dashboard')
    }catch(error){
        console.log(error);
        
    }
}

const logout = async (req,res) =>{
    try{
        req.session.destroy();
        res.redirect('/admin/login')

    }catch(error){
        console.log(error);
        
    }
}


module.exports = {loadLogin,login,loadDashboard,editUser,deleteUser,addUser,logout}