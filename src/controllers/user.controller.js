const {
  errorResponseHandle,
  INVELID_JSON,
  SUCCESS,
  successResponseHandle,
} = require("../helpers/responceHendler.js");

const User = require("../models/users");
const jwt=require("jsonwebtoken")

exports.userRegister = async (req, res) => {
  const user_exist = await User.find({ email: req.body.email });
  if (user_exist.length > 0) {
    return res
      .status(INVELID_JSON)
      .json(successResponseHandle({ message: "User already exist" }));
  }
  var user = new User(req.body);
  await user.save(function (err, result) {
    if (err) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: err.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(result, "User registered successfully"));
    }
  });
};

exports.getUsers = async (req, res) => {
  const userData = await User.find({ id_deleted: false }).populate("devices");
  return res.status(SUCCESS).json(successResponseHandle(userData, "All users"));
};

exports.getUserDevice = async (req, res) => {
  const myDevices = await User.find(
    { _id: req.query.user_id },
    "devices"
  ).populate("devices");
  return res
    .status(SUCCESS)
    .json(successResponseHandle(myDevices, "my devices"));
};

exports.deleteUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body.user_id },
    { $set: { is_deleted: true } },
    { returnDocument: "after" },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, "Delete successfully"));
      }
    }
  );
};

exports.updateUser = async (req, res) => {
  const userData = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: req.body },
    { returnDocument: "after" }
  );
  return res
    .status(SUCCESS)
    .json(successResponseHandle(userData, "updated user"));
};

exports.userLogin = async (req, res) => {
    const user=await User.findOne({"email":req.body.email,"password":req.body.password})
    if(!user) return res
    .status(SUCCESS)
    .json(successResponseHandle( {"message":"user not found"}));
    const token = jwt.sign({
        userId: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        devices:user.devices
    },
        "this is for login token",
        {
            expiresIn: "50h"
        }
    )
    user_data = {
        id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        devices:user.devices,
        token: token
    }
    return res
      .status(SUCCESS)
      .json(successResponseHandle(user_data, "logged user"));
  };

