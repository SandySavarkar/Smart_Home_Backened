const {
  errorResponseHandler,
  SUCCESS,
  INVELID_JSON,
  successResponseHandler,
} = require("../helpers/response_json");

const Device = require("../models/device");
const User = require("../models/user");

exports.createDevice = async (req, res) => {
  const DeviceData = await Device.find({
    serial_number: req.body.serial_number,
  });
  if (DeviceData.length > 0)
    return res
      .status(INVELID_JSON)
      .json(successResponseHandler({ message: "Device already exist" }));
  else {
    let finalData = {
      serial_number: req.body.serial_number,
      name: "My new Device",
    };
    const device = new Device(finalData);
    device.save(function (err, result) {
      if (err)
        return res.status(INVELID_JSON).json(successResponseHandler(err));
      else
        return res
          .status(SUCCESS)
          .json(successResponseHandler(result, "User Created Successfully"));
    });
  }
};

exports.deleteDevice = async (req, res) => {
    const deviceData = await Device.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { is_deleted: true } }
    );
    return res
      .status(SUCCESS)
      .json(successResponseHandler({ is_deleted: true }, "deleted device"));
  };

  exports.usersDevice=async(req,res)=>{
    const mydevice=await User.find({'_id':req.params.id},'devices').populate('devices')
    return res
    .status(SUCCESS)
    .json(successResponseHandler(mydevice, "my devices"));
  }