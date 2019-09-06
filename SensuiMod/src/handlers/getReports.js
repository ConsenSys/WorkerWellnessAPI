class GetReportsHandler {
  constructor(ethereumMgr) {
    this.ethereumMgr = ethereumMgr;
  }

  async handle(event, context, cb) {
    try {
      let res = await this.ethereumMgr.getReports()
      console.log(res)
      cb(null, res);
    } catch (err) {
      cb({ code: 500, message: "Get reports error: " +  err.message });
    }
  }
}

module.exports = GetReportsHandler;
