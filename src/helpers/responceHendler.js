exports.SUCCESS = 200;
exports.INVELID_JSON = 401;

exports.successResponseHandle = (data, message) => {
  return {
    isSuccess: true,
    status: this.SUCCESS,
    message: message ? message : 'Action perform success',
    data,
  };
};

exports.errorResponseHandle = (error, code) => {
  return {
    isSuccess: false,
    status: code,
    error,
  };
};
