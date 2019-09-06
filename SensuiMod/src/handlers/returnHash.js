var contract = require("truffle-contract");
var SurveyMapping = require('../build/contracts/SurveyMapping-full.json')

class ReturnHashHandler {
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

    try {
      const surveyMapping = contract(SurveyMapping)
      await surveyMapping.setProvider(this.ethereumMgr.getProvider(body.blockchain))
      const surveyInstance = await surveyMapping.at('0xb43404c5f013F91041FAE7fcc208A13b129509EE')
      var result = await surveyInstance.ReturnHash(body.surveyId)
      cb(null, result);
    } catch (err) {
      cb({ code: 500, message: "Get hash by surveyId error: " +  err.message });
      return;
    }
  }
}
module.exports = ReturnHashHandler;
