// API Ref: https://opentdb.com/api_config.php
const request = require("request");
const categories = { "Books": 10,
                     "Film": 11, 
                     "Computer": 18,
                     "Math": 19,
                     "Mythology": 20,
                     "Geography": 22,
                     "History": 23,
                     "Politics": 24,
                     "Animals": 27};

var triviaGenerator = {
  getCategories: function(){
    return categories;
  },
  getSessionToken: function(callback) {
    request({
        url: "https://opentdb.com/api_token.php?command=request",
        method: "GET"
      }, (err, res, body) => {
        if (!err) {
          data = JSON.parse(body)
          callback(data.token);
        } else {
          console.error("Unable to send message:" + err);
        }
      }
    );
  },
  getQuestions: function(token, category, callback) {
    let params = "amount=1&encode=url3986&category="+category+"&token="+token;
    let req_url = "https://opentdb.com/api.php?"+params;
    request({
        url: req_url,
        method: "GET"
      }, (err, res, body) => {
        if (!err) {
          callback(JSON.parse(body));
        } else {
          console.error("Unable to send message:" + err);
        }
      }
    );
  }
}

module.exports = triviaGenerator;