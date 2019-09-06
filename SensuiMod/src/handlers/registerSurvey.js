import { sha256 } from 'js-sha256';

class RegisterSurveyHandler {
  constructor(ethereumMgr) {
    this.ethereumMgr = ethereumMgr;
  }

  async handle(event, context, cb) {
    let body;

    if (event && !event.body) {
      body = event;
    } else if (event && event.body) {
      try {
        body = JSON.parse(event.body);
      } catch (e) {
        cb({ code: 400, message: "no json body" });
        return;
      }
    } else {
      cb({ code: 400, message: "no json body" });
      return;
    }

    /* checking for inputs */
    if (!body.surveyId) {
      cb({ code: 400, message: "surveyId parameter missing" });
      return;
    }
    if (!body.report) {
      cb({ code: 400, message: "report parameter missing" });
      return;
    }
    if (!isJSON(body.report)) {
      cb({ code: 400, message: "report is not valid JSON" });
      return;
    }
    if (!body.methodName) {
      cb({ code: 400, message: "methodName parameter missing" });
      return;
    }
    if (!body.blockchain) {
      cb({ code: 400, message: "blockchain parameter missing" });
      return;
    } else if (body.blockchain.toLowerCase() != 'rinkeby' && body.blockchain.toLowerCase() != 'mainnet' && body.blockchain.toLowerCase() != 'kovan' && body.blockchain.toLowerCase() != 'ropsten') {
      cb({ code: 400, message: "blockchain parameter not valid" });
      return;
    }

    console.log('Received request is OK')

    console.log('\nHash: ' + sha256(body.report))

    //get transaction made
    console.log('Building raw tx')
    let rawTx;
    let reportHash = sha256(body.report)
    try {
      rawTx = await this.ethereumMgr.makeTx({
        surveyId: body.surveyId,
        hash: reportHash,
        blockchain: body.blockchain.toLowerCase(),
        methodName: body.methodName,
      });
    } catch (err) {
      console.log("Error on this.ethereumMgr.makeTx");
      console.log(err);
      cb({ code: 500, message: err.message + " Originating from registerSurvey.js calling makeTx from ethereumMgr.js."});
      return;
    }
    console.log('Raw tx: ' + JSON.stringify(rawTx))
    //get rawTx signed
    console.log('Building signed raw tx')
    let signedRawTx;
    try {
      signedRawTx = await this.ethereumMgr.signTx({
        tx: rawTx,
        blockchain: body.blockchain.toLowerCase(),
      });
    } catch (err) {
      console.log("Error on this.ethereumMgr.signTx");
      console.log(err);
      cb({ code: 500, message: "Sign Raw Tx Error: " + err.message });
      return;
    }
    // const tx = new Transaction(signedRawTx);
    // const serializedTx = '0x' + tx.serialize().toString("hex");
    console.log('Signed raw tx: ' + signedRawTx)
    //sets transaction hash from created and sent signed transaction - CHANGE
    console.log('Sending tx')
    let txHash;
    try {
      txHash = await this.ethereumMgr.sendRawTransaction(
        signedRawTx,
        body.blockchain.toLowerCase(),
      );
      await this.ethereumMgr.saveReport(txHash, body.report, reportHash, body.surveyId)
      cb(null, txHash);
    } catch (err) {
      console.log("Error on this.ethereumMgr.sendRawTransaction");
      console.log(err);
      cb({ code: 500, message: "Send Raw Tx Error: " +  err.message });
      return;
    }
    console.log('Tx hash: ' + txHash)
  }
}
module.exports = RegisterSurveyHandler;

function isJSON(str){
  try {
    JSON.parse(str)
  } catch (error) {
    return false
  }
  return true
}