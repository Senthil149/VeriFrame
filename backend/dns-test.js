const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.veriframe.fy7gcfk.mongodb.net", (err, records) => {
  if (err) {
    console.error("DNS Error:", err);
  } else {
    console.log("SRV Records:", records);
  }
});