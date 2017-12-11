var mongoClient = require("mongodb").MongoClient;
var mongoDB;
const collection = "user";

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

exports.findByUsername = function(username, callback) {
  console.log(username);
  mongoDB.collection(collection).find({"username": username}).toArray(function(err, docs) {
    callback(err, docs[0]);
  });
}

exports.findById = function(id, callback) {
  mongoDB.collection(collection).find(id).toArray(function(err, docs) {
    callback(err, docs);
  });
}



exports.retrieve = function(query, callback) {
  mongoDB.collection(collection).find(query).toArray(function(err, docs) {
    if (err) doError(err);
    callback(docs);
  });
}

exports.update = function(filter, update, callback) {
  mongoDB.collection(collection)
    .updateMany(filter, update, {upsert: true}, function(err, status) {
      if (err) doError(err);
      callback("Modified " + status.modifiedCount 
        + " and added " + status.upsertedCount + " documents.");
    }); 
}

exports.delete = function(filter, callback) {
  mongoDB.collection(collection).deleteOne(filter, function(err, status) {
    if (err) doError(err);
    var success = (status.result.n == 1 ? true : false);
    callback(success);
  });
}