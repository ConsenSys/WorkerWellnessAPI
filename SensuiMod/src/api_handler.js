"use strict";
const AWS = require("aws-sdk");

const AuthMgr = require("./lib/authMgr");
const EthereumMgr = require("./lib/ethereumMgr");
const RegisterSurveyHandler = require('./handlers/registerSurvey');
const ReturnHashHandler = require('./handlers/returnHash');
const GetReportsHandler = require('./handlers/getReports');

/*
creating instantiations of the necessary elements to carry out
tx being signed, sent to relay, verified, funded, and sent to blockchain
*/
let authMgr = new AuthMgr();
let ethereumMgr = new EthereumMgr();
let registerSurveyHandler = new RegisterSurveyHandler(ethereumMgr);
let returnHashHandler = new ReturnHashHandler(ethereumMgr);
let getReportsHandler = new GetReportsHandler(ethereumMgr);

module.exports.registerSurvey = (event, context, callback) => {
  preHandler(registerSurveyHandler, event, context, callback);
};

module.exports.returnHash = (event, context, callback) => {
  preHandler(returnHashHandler, event, context, callback);
};

module.exports.getReports = (event, context, callback) => {
  preHandler(getReportsHandler, event, context, callback);
};

/*
prehandler function to ensure secrets are set then sends api status request
*/
const preHandler = (handler, event, context, callback) => {
  console.log(event);
  if (!ethereumMgr.isSecretsSet() || !authMgr.isSecretsSet()) {
    const kms = new AWS.KMS();
    kms
      .decrypt({
        CiphertextBlob: Buffer(process.env.SECRETS, "base64")
      })
      .promise()
      .then(data => {
        const decrypted = String(data.Plaintext);
        ethereumMgr.setSecrets(JSON.parse(decrypted));
        authMgr.setSecrets(JSON.parse(decrypted));
        doHandler(handler, event, context, callback);
      });
  } else {
    doHandler(handler, event, context, callback);
  }
};

const doHandler = (handler, event, context, callback) => {
  handler.handle(event, context, (err, resp) => {
    let response;
    console.log('\nResponse: ' + resp)
    console.log('\nError: ' + err)
    if (err == null) {
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
        },
        body: JSON.stringify({
          status: "success",
          data: resp
        })
      };
    } else {
      //console.log(err);
      let code = 500;
      if (err.code) code = err.code;
      let message = err;
      if (err.message) message = err.message;

      response = {
        statusCode: code,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT"
        },
        body: JSON.stringify({
          status: "error",
          message: message
        })
       };
    }

    callback(null, response);
  });
};
