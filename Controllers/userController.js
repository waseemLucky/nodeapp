const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const CreateToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) return res.status(400).json('This email is already exists.');
    if (!name || !email || !password) return res.status(400).json('All the fields are required.');
    if (!validator.isEmail(email)) return res.status(400).json('Please enter a valid email.');
    if (!validator.isStrongPassword(password)) return res.status(400).json('Please enter a strong password.');

    user = new userModel({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(8);
    user.password = await bcrypt.hash(user.password, salt); // Await the result of bcrypt.hash

    await user.save();
    const token = CreateToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });
    if (!user) return res.status(400).json('Wrong email and password.');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json('Wrong email and password.');
    const token = CreateToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
