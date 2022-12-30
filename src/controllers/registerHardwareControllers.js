import {
  errorResponseHandle,
  INVELID_JSON,
  SUCCESS,
  successResponseHandle,
} from '../helpers/responceHendler.js';
import nodeMcuSchema from '../models/nodeMcuHardware.js';

const newRegistrationAction = (data, res) => {
  var nodeMcu = new nodeMcuSchema(data);
  nodeMcu.save(function (err, result) {
    if (err) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: err.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(result, 'Register successfully'));
    }
  });
};

const updateNodeMcuData = (qury, updateData, res) => {
  nodeMcuSchema.findOneAndUpdate(qury, updateData, function (error, data) {
    if (error) {
      return res
        .status(INVELID_JSON)
        .json(successResponseHandle({ message: error.message }));
    } else {
      return res
        .status(SUCCESS)
        .json(successResponseHandle(data, 'Update successfully'));
    }
  });
};

export const getHardwareOnline = async (req, res) => {
  const { serial_number } = req.body;

  if (!serial_number) {
    return res
      .status(INVELID_JSON)
      .json(
        errorResponseHandle({ message: 'All field is required' }, INVELID_JSON),
      );
  }
  const saveData = {
    serial_number,
    last_online_at: new Date().getTime(),
  };
  const qury = {
    serial_number: { $eq: serial_number },
  };
  const nodeAvailableData = await nodeMcuSchema.find(qury);

  if (nodeAvailableData.length !== 0) {
    updateNodeMcuData(qury, saveData, res);
  } else {
    newRegistrationAction(saveData, res);
  }
};
