const {
  INVELID_JSON,
  SUCCESS,
  successResponseHandle,
} = require("../helpers/responceHendler.js");

const Device = require("../models/device");
const User = require("../models/users.js");

exports.deviceRegister = async (req, res) => {
  const serial_no_exist = await Device.find({
    serial_number: req.body.serial_number,
  });
  if (serial_no_exist.length > 0) {
    return res
      .status(INVELID_JSON)
      .json(successResponseHandle({ message: "Device already exist" }));
  }
  const insert_device_data = {
    serial_number: req.body.serial_number,
    name: "my device",
  };
  const device = new Device(insert_device_data);

  await device.save(function (error, data) {
    if (error) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: error.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(data, "create successfully"));
    }
  });
};

exports.getDevices = async (req, res) => {
  const deviceData = await Device.find({ is_deleted: false });
  return res
    .status(SUCCESS)
    .json(successResponseHandle(deviceData, "All Devices"));
};

exports.updateDevice = (req, res) => {
  Device.findOneAndUpdate(
    { serial_number: req.body.serial_number },
    { $set: req.body },
    { returnDocument: "after" },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, "Update successfully"));
      }
    }
  );
};

exports.deleteDevice = (req, res) => {
  Device.findOneAndUpdate(
    { serial_number: req.body.serial_number },
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

exports.updateDevicePin = async (data) => {
  await Device.updateOne(
    { serial_number: data.devicesId.toString(), "pins.pinId": data.pinId },
    { $set: { "pins.$.status": data.value } }
  );
};

exports.scheduleTime = (req, res) => {
  Device.updateOne(
    { serial_number: req.body.serial_number, "pins.pinId": req.body.pinId },
    {
      $set: {
        "pins.$.scheduleStartDateTime": req.body.scheduleStartDateTime,
        "pins.$.scheduleStopDateTime": req.body.scheduleStopDateTime,
      },
    },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, "Schedule update successfully"));
      }
    }
  );
};

exports.getAvailableDevice = async (req, res) => {
  const deviceData = await Device.find({ is_deleted: false });
  let newArray = [];
  if (deviceData.length > 0) {
    await Promise.all(
      deviceData.map(async (item) => {
        const userData = await User.aggregate([
          { $match: { devices: item._id } },
        ]);
        if (userData.length == 0) await newArray.push(item);
      })
    );
  }
  return res
    .status(SUCCESS)
    .json(successResponseHandle(newArray, "Available devices"));
};
