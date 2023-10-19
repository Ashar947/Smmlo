const { json } = require("express");

const throw_error = (errorMsg) => {
    console.log("throw error")
    const error_response = new Error(errorMsg);
    error_response.message = errorMsg;
    throw error_response;
};


module.exports = { throw_error };