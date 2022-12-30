exports.SUCCESS=200
exports.INVELID_JSON=500

exports.successResponseHandler=(data,message)=>{
    return {
        isSucess:true,
        status:this.SUCCESS,
        message:message?message:"Action perform success",
        data
    }
}

exports.errorResponseHandler=(error,code)=>{
    return {
        isSucess:false,
        status:code,
        error
    }
}
