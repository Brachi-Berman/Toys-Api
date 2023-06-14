const mongoose = require("mongoose");
const Joi = require("joi");

const toySchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    user_id: String,
    dateCreated: {
        type: Date, default: Date.now()
    }
});
exports.ToyModel = mongoose.model("toys", toySchema);

exports.ValidateToy = (_reqBody) => {
    let schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: Joi.string().min(3).max(999999).allow(null, ""),
        category: Joi.string().min(2).max(99).required(),
        img_url: Joi.string().min(3).max(999999).allow(null, ""),
        price: Joi.number().min(2).max(1000000).required(),
    });
    return schemaJoi.validate(_reqBody);
}