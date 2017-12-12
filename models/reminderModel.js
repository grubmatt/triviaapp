var mongoClient = require("mongodb").MongoClient;
var mongoDB;
const collection = "reminder";

mongoClient.connect("mongodb://admin:123456@ds113626.mlab.com:13626/trivia", function(err, db) {
  if (err) doError(err);
  mongoDB = db;
});

exports.create = function(data, callback) {
  mongoDB.collection(collection).insertOne(data, function(err, status) {
    if (err) doError(err);
    var success = (status.result.n == 1 ? true : false);
    callback(success);
  });
}

exports.retrieve = function(query, callback) {
  mongoDB.collection(collection).find(query).toArray(function(err, docs) {
    if (err) doError(err);
    callback(docs);
  });
}

exports.delete = function(filter, callback) {
  mongoDB.collection(collection).deleteOne(filter, function(err, status) {
    if (err) doError(err);
    var success = (status.result.n == 1 ? true : false);
    callback(success);
  });
}

var doError = function(e) {
  throw new Error(e);
}