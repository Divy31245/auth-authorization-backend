import mongoose from "mongoose";

const role = new mongoose.Schema({
    name:{
        type:String,
    }
})

const roleSchema = mongoose.model("Role",role);

export default roleSchema;