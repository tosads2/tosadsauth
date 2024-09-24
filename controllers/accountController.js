require('dotenv').config();
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken')
const validator = require('validator')

const accountSchema = require("../models/accountModel.js");

const createAccount = async (req, res) => {
    const { username, email } = req.body;
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    try {
        const existingUser = await accountSchema.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
    const newAccount = await accountSchema.create({
        username,
        email,
        password: req.user.password,  // Encrypted password
        authenticate: false
    });
    
    return res.json({message:'تم إنشاء الحساب، يرجى طلب تفعيله من المسؤولين ومن ثم تسجيل الدخول'});
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
};

const login = async (req,res) =>{
    const {email, password} = req.body 
    let account = await accountSchema.findOne({email})
    if (!account) {
        return res.status(401).json({"message":'wrong email'})
    }
    let accountPassword = await decryptPassword(account.password)
    if (accountPassword == password) {
        const token = jwt.sign({id: account._id, username:account.username ,authenticate: account.authenticate}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
        return res.status(200).json({"message":'welcome', token})
    } else {
        return res.status(401).json({"message":'wrong password'})
    }
}
const checkToken = async (req,res) =>{
    let tokenGiven = req.body['sentToken']
        try {
            let tokendata = jwt.verify(tokenGiven,process.env.ACCESS_TOKEN_SECRET)  

            if (tokendata["authenticate"] == false) {
                return res.status(401).json({'message':"authenticate"})
            } else {
                return res.status(200).json({'message':"access", "name": tokendata['username']})

            }
        } catch {
            return res.status(401).json({'message':"no"})
        }
}

function cryptPassword(req, res, next) {
    try {
        const iv = CryptoJS.lib.WordArray.random(16);
        const cryptedPassword = CryptoJS.AES.encrypt(req.body.password, CryptoJS.enc.Utf8.parse(process.env.CRYPT_KEY), { iv: iv });
        req.user = { ...req.user, password: iv.toString() + ':' + cryptedPassword.toString() };
        next();
    } catch (error) {
        return res.status(500).send('Internal server error');
    }
}


function decryptPassword(encryptedPassword) {
    try {
        const [ivHex, encryptedText] = encryptedPassword.split(':');
        const iv = CryptoJS.enc.Hex.parse(ivHex);
        const bytes = CryptoJS.AES.decrypt(encryptedText, CryptoJS.enc.Utf8.parse(process.env.CRYPT_KEY), { iv: iv });
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        if (decryptedPassword) {
            return decryptedPassword;
        } else {
            return 'wrong password';
        }
    } catch (error) {
        console.error("Error decrypting password:", error);
        throw error;
    }
}


module.exports = {
    createAccount,
    login,
    cryptPassword,
    decryptPassword,

    checkToken
};
