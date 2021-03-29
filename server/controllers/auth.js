const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('./utilities/validation');
const bcrypt = require('bcryptjs');

function register(req, res) {

    //validate
    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);


    //check if user already in db
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist)
        return res.status(400).send('Email already exists');

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
}

//login
function login(req, res) {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //check if email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        res.status(400).send('no user with this email exists');

    //user exist
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.status(400).send('incorrect password');

    //create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

}

module.exports = { register, login }