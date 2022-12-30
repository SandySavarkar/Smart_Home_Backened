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
