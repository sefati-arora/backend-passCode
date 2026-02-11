require("dotenv").config();
const Models = require("../models/index");
const helper = require("../helper/validation");
const commonHelper = require("../helper/commonHelper");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
module.exports = {
  adminLogin: async (req, res) => {
    try {
      const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      });
      const payload = await helper.validationJoi(req.body, schema);
      const { email, password } = payload;
      var admin = await Models.userModel.findOne({ where: { email } });
      console.log(admin);
      if (!admin) {
        const hash = await argon2.hash(password);
         admin = await Models.userModel.create({
          email,
          password: hash,
          role: 2,
          deviceToken: 1,
          passCode: 123,
          step: 1,
        });
      }
      const token = jwt.sign({ id: admin.id }, process.env.SECRET_KEY);
      return res.status(200).json({ message: "ADMIN LOGIN!", admin, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: " SERVER ERROR", error });
    }
  },
  otpVerify: async (req, res) => {
    try {
      const { email } = req.params;
      const { otp } = req.body;
      if (!otp) {
        return res.status(400).json({ message: "OTP NOT FOUND!" });
      }
      const admin = await Models.userModel.findOne({ where: { email } });
      if (!admin) {
        return res.status(404).json({ message: "ADMIN NOT FOUND!" });
      }
      if (admin.otp != otp) {
        return res.status(401).json({ message: "INVALID OTP" });
      }
      await Models.userModel.update(
        { otpVerify: 2, otp: null, step: 3 },
        { where: { email } },
      );
      return res.status(200).json({ message: "OTP VERIFIED!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR!", error });
    }
  },
  logOut: async (req, res) => {
    try {
      const id = req.user.id;
      const admin = await Models.userModel.findOne({ where: { id } });
      if (!admin) {
        return res.status(404).json({ message: "ADMIN NOT FOUND!" });
      }
      await Models.userModel.update({ deviceToken: null }, { where: { id } });
      const update = await Models.userModel.findOne({ where: { id } });
      return res.status(200).json({ message: "LOGOUT SUCCESSFULLY!", update });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR", error });
    }
  },
  userFetch: async (req, res) => {
    try {
      const user = await Models.userModel.findAll({ where: { role: 1 } });
      if (!user) {
        return res.status(404).json({ message: "USER NOT FOUND!" });
      }
      return res.status(200).json({ message: "USER FETCH:", user });
    } catch (error) {
      return res.status(500).json({ message: "ERROR", error });
    }
  },
  bookingFetch: async (req, res) => {
    try {
      const booking = await Models.bookingModel.findAll();
      if (!booking) {
        return res.status(404).json({ message: "BOOKING NOT FOUND!" });
      }
      return res
        .status(200)
        .json({ message: "BOOKING FETCH SUCCESSFULLY!", booking });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR", error });
    }
  },
  EditPasscode: async (req, res) => {
    try {
      const schema = Joi.object({
        currentPassCode: Joi.number().required(),
        newPassCode: Joi.number().required(),
        confirmPassCode: Joi.number().valid(Joi.ref("newPassCode")).required(),
      });
      const payload = await helper.validationJoi(req.body, schema);
      const { currentPassCode, newPassCode } = payload;
      const id = req.user.id;
      console.log(">>", id);
      const admin = await Models.userModel.findOne({ where: { id } });
      if (!admin) {
        return res.status(404).json({ message: "ADMIN NOT FOUND!" });
      }
      console.log(">>", admin.passCode);
      if (admin.passCode !== currentPassCode) {
        return res.status(404).json({ message: "INVALID PASSCODE" });
      }
      if (currentPassCode == newPassCode) {
        return res.status(400).json({ message: "PASSCODE MUST BE DIFFERENT!" });
      }
      const otp = Math.floor(1000 + Math.random() * 9000);
      await Models.userModel.update(
        { passCode: newPassCode, otp, step: 2 },
        { where: { id } },
      );
      const otpSend = await commonHelper.otpSendLinkHTML(req, admin.email, otp);
      console.log(otpSend);
      const update = await Models.userModel.findOne({ where: { id } });
      return res.status(200).json({ message: "PASSCODE CHANGED!", update });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR", error });
    }
  },
  DashBoardData: async (req, res) => {
    try {
      const user = await Models.userModel.count({ where: { role: 1 } });
      const booking = await Models.bookingModel.count();
      return res.status(200).json({ message: "DASH BOARD:", user, booking });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR!", error });
    }
  },
  verifyPasscode: async (req, res) => {
    try {
      const { passCode } = req.body;
      const user = await Models.userModel.findOne({
        where: { passCode: passCode },
      });
      if (!user) {
        return res.status(404).json({ message: "PASSCODE NOT FOUND" });
      }
      return res.status(200).json({ message: "PASSCODE:", user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR!", error });
    }
  },
};
