const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middleware/auth");
const { UserModel, validateLogin, validateUser, createToken } = require("../models/userModel");
const { ToyModel } = require("../models/toyModel")

router.get("/usersList",authAdmin, async (req, res) => {
    try {
        let userInfo = await UserModel.find({}, { password: 0 });
        res.json(userInfo);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.get("/myInfo", auth, async (req, res) => {
    try {
        let userInfo = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        res.json(userInfo);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.post("/", async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);

        await user.save();
        user.password = "********";
        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })
        }
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})

router.post("/login", async (req, res) => {
    let validBody = validateLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "Password or email is worng ,code:2" })
        }
        let authPassword = await bcrypt.compare(req.body.password, user.password);
        if (!authPassword) {
            return res.status(401).json({ msg: "Password or email is worng ,code:1" });
        }
        let token = createToken(user._id, user.role);
        res.json({ token });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.put("/:editId", auth, async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data;
        console.log(req.tokenData);
        if (req.tokenData.role == "admin") {
            data = await ToyModel.updateOne({ _id: editId }, req.body);
        }
        else {
            data = await ToyModel.updateOne({ _id: editId, _id: req.tokenData._id }, req.body)
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

module.exports = router;