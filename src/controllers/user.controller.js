const {
  errorResponseHandler,
  SUCCESS,
  INVELID_JSON,
  successResponseHandler,
} = require("../helpers/response_json");

const Device = require("../models/device");
const User = require("../models/user");

exports.createUser = async (req, res) => {
  const userData = await User.find({ email: req.body.email });
  if (userData.length>0)
    return res
      .status(INVELID_JSON)
      .json(successResponseHandler({ message: "User already exist" }));
  else {
    const user = new User(req.body);
    console.log(user, "user");
    user.save(function (err, result) {
      if (err)
        return res.status(INVELID_JSON).json(successResponseHandler(err));
      else {
        return res
          .status(SUCCESS)
          .json(successResponseHandler(result, "User Created Successfully"));
      }
    });
  }
};

exports.getAllUser= async (req,res)=>{
    const userData=await User.find({"is_deleted":false}).populate("devices")
    return res
          .status(SUCCESS)
          .json(successResponseHandler(userData, "All users"));
}

exports.deleteUser= async (req,res)=>{
    const userData=await User.findOneAndUpdate({"_id":req.params.id},{$set: { "is_deleted":true }})
    return res
          .status(SUCCESS)
          .json(successResponseHandler(userData, "deleted user"));
}