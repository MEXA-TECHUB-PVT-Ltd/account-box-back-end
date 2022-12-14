const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tycoon_id:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tycoon'
    },
    manager_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'managers'
    },
    name: String,
    img: String,
    created_at: String,
}
);
module.exports = mongoose.model("shop", shopSchema);