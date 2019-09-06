var express = require('express');
var router = express.Router();
const { Client } = require('pg')

function parseReportsResponse(sql_reports) {
  let jsonReports = []
  sql_reports.forEach(report => {
    jsonReports.push(JSON.parse(report['report_json']))
  });
  return jsonReports
}

module.exports = async (req, res) => {
  var pgUrl = 'postgresql://B4SIGA:Social1mp4ct@workers-well-db.c0efkqdxrumb.us-west-1.rds.amazonaws.com:2345/workerswelldb'

  const client = new Client({
    connectionString: pgUrl
  });

  try {
    await client.connect();
    let query = await client.query(
      "SELECT report_json \
             FROM reports "
    );
    // res.json(result)
    res.send(parseReportsResponse(query.rows));
    // return 
  } catch (e) {
    throw e;
  } finally {
    await client.end();
  }
}

// router('/reports', function(req, res, next) {



  
// });

// module.exports = router;
