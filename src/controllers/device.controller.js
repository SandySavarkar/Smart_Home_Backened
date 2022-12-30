const {
  INVELID_JSON,
  SUCCESS,
  successResponseHandle,
} = require("../helpers/responceHendler.js");

const Device = require("../models/device");
const User = require("../models/users.js");
const historyController = require("../controllers/history.controller");
const moment = require("moment-timezone");
const cron = require("node-cron");

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

exports.updateDevicePinData = (req, res) => {
  let objectPass = {};
  if (req.body.scheduleStartDateTime) {
    objectPass["pins.$.scheduleStartDateTime"] = req.body.scheduleStartDateTime;
  }
  if (req.body.scheduleStopDateTime) {
    objectPass["pins.$.scheduleStopDateTime"] = req.body.scheduleStopDateTime;
  }
  if (req.body.pinName) {
    objectPass["pins.$.pinName"] = req.body.pinName;
  }
  if (req.body.status) {
    objectPass["pins.$.status"] = req.body.status;
  }
  if (req.body.watt) {
    objectPass["pins.$.watt"] = req.body.watt;
  }
  if (req.body.limit) {
    objectPass["pins.$.limit"] = req.body.limit;
  }
  if (req.body.relatedManualPinName) {
    objectPass["pins.$.relatedManualPinName"] = req.body.relatedManualPinName;
  }
  if (req.body.relatedManualPin) {
    objectPass["pins.$.relatedManualPin"] = req.body.relatedManualPin;
  }
  Device.updateOne(
    { serial_number: req.body.serial_number, "pins.pinId": req.body.pinId },
    { $set: objectPass },
    { returnDocument: "after" },
    function (error, data) {
      if (error) {
        return res
          .status(INVELID_JSON)
          .json(successResponseHandle({ message: error.message }));
      } else {
        return res
          .status(SUCCESS)
          .json(successResponseHandle(data, " update successfully"));
      }
    }
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
        try {
          let start_time = req.body.scheduleStartDateTime;
          let end_time = req.body.scheduleStopDateTime;
          var fmt = "DD MM hh mm";
          var zone = "America/New_York";

          const formatedDate = moment(start_time).tz(zone).format(fmt);

          console.log(formatedDate, "++++");

          const dateArray = formatedDate.split(" ");
          const day = dateArray[0];
          const month = dateArray[1];
          const hour = dateArray[2];
          const minute = dateArray[3];

          console.log("m: ", formatedDate);

          cron.schedule(
            `${minute} ${hour} ${day} ${month} *`,
            async () => {
              console.log("schedule");

              let data = {
                devicesId: parseInt(req.body.serial_number),
                value: false,
                pinId: req.body.pinId,
              };

              console.log("timme", data);

              await crateAndUpdateHistoryFromscheduleTime(data);
              await Device.updateOne(
                {
                  serial_number: data.devicesId.toString(),
                  "pins.pinId": data.pinId,
                },
                { $set: { "pins.$.status": data.value } }
              );


              const formatedDate = moment(end_time).tz(zone).format(fmt);
              const dateArray = formatedDate.split(" ");
              const day = dateArray[0];
              const month = dateArray[1];
              const hour = dateArray[2];
              const minute = dateArray[3];

              //end time
              cron.schedule(
                `${minute} ${hour} ${day} ${month} *`,
                async () => {
                  let data = {
                    devicesId: parseInt(req.body.serial_number),
                    value: true,
                    pinId: req.body.pinId,
                  };

                  console.log("offtime");
                  await crateAndUpdateHistoryFromscheduleTime(data);
                  await Device.updateOne(
                    {
                      serial_number: data.devicesId.toString(),
                      "pins.pinId": data.pinId,
                    },
                    { $set: { "pins.$.status": data.value } }
                  );

                  console.log("end event", req.body);
                },
                {
                  scheduled: true,
                  timezone: "America/New_York",
                }
              );
            },
            {
              scheduled: true,
              timezone: "America/New_York",
            }
          );

          return res
            .status(SUCCESS)
            .json(successResponseHandle(data, "Schedule update successfully"));
        } catch (error) {
          console.error(error);
        }
      }
    }
  );
};

async function crateAndUpdateHistoryFromscheduleTime(data) {
  console.log("function data");
  console.log("data: ", data);
  const deviceData = await Device.findOne({
    serial_number: data.devicesId.toString(),
  });

  myDevice = Object.values(deviceData.pins).filter(
    (x) => x.pinId === data.pinId
  );
  console.log("myDevice: ", myDevice);
  console.log(myDevice[0].status, "status value");

  if (data.value !== myDevice[0]?.status) {
    // const userData = await User.aggregate([
    //   { $match: { devices: deviceData._id.toString() } },
    // ]);
    // console.log(deviceData,"device");
    // data['user_id'] = userData[0]._id;

    data["device_id"] = deviceData._id;
    if (data.value === false) {
      const history = new History({
        device_id: data.device_id,
        // user_id: data.user_id,
        switch_on_time: new Date(),
        pin_Id: data.pinId,
        switch_off_time: null,
        defaultWattOfPin: myDevice[0].watt,
      });

      history.save();
    } else {
      let finalData = {};
      const history = await History.findOne({
        device_id: data.device_id,
        // user_id: data.user_id,
        pin_Id: data.pinId,
        switch_off_time: null,
      });

      finalData["switch_off_time"] = new Date();

      let difference =
        (new Date(Date.now()).getTime() -
          new Date(history.switch_on_time).getTime()) /
        1000;
      let hoursDifference = (difference / (60 * 60))?.toFixed(3);

      finalData["duration"] = hoursDifference + "hr";

      let myDevice = await Device.findOne(
        {
          _id: data.device_id,
        },
        "pins"
      );
      myDevice = Object.values(myDevice.pins).filter(
        (x) => x.pinId === data.pinId
      );

      let watt = myDevice[0].watt == "" ? 1000 : myDevice[0].watt;
      let totalWattPrHr = watt * hoursDifference;
      let unit = totalWattPrHr / 1000;
      let cost = (unit * 12)?.toFixed(4);

      finalData["cost"] = cost;
      finalData["consumptionWattPerHour"] = totalWattPrHr;

      await History.updateOne(
        {
          device_id: data.device_id,
          // user_id: data.user_id,
          pin_Id: data.pinId,
          switch_off_time: null,
        },
        { $set: finalData }
      );
    }
  }
}
