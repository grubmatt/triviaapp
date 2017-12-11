var questionModel = require("../models/questionModel.js");
var userModel = require("../models/userModel.js");
var reminderModel = require("../models/reminderModel.js");
const trivia = require("../models/triviaAPI.js")
const user = "/user", question = "/question", reminder = "/reminder";
var token = "";

exports.init = function(app) {
  app.get("/", index);

  app.get(question, getQuestion);

  app.put(user, createUser);
  app.get(user, retrieveUser);
  app.post(user, updateUser);
  app.delete(user, deleteUser);

  app.put(reminder, createReminder);
  app.get(reminder, retrieveReminder);
  app.post(reminder, updateReminder);
  app.delete(reminder, deleteReminder);
}

index = function(req, res) {
  res.render("index", {title: "Trivia Game"})
}

getQuestion = function(req, res) {
  if(token == "") {
    trivia.getSessionToken(function(result) {
      token = result;
      getQuestionHelper(req, res);
    });
  } else {
    getQuestionHelper(req, res);
  }
}

function getQuestionHelper(req, res) {
  trivia.getQuestions(token, req.query.category, function(data) {
    res.render("question", {title: "Trivia Game", 
      question: unescape(data.results[0].question),
      type: data.results[0].type,
      answers: randomizeAnswers(data.results[0]),
      answer: data.results[0].correct_answer,
      category: req.query.category
      });
  });
}

function randomizeAnswers(question) {
  var answers = question.incorrect_answers;
  answers.push(question.correct_answer);
  
  return answers;
}

createUser = function(req, res) {
  if (Object.keys(req.body).length == 0) {
    res.render("message", {title: "Trivia Game", obj: "No create body found"});
    return;
  }

  userModel.create(req.body, function(result) {
    var success = (result ? "Create Successful" : "Create unsuccsessful");
    res.render("message", {title: "Trivia Game", obj: success});
  });
}

retrieveUser = function(req, res) {
  userModel.retrieve(req.query, function(data) {
    if (data.length) {
      res.render("results", {title: "Trivia Game", obj: data})
    }

    var message = "No documents with "+JSON.stringify(req.query)+
                  " in collection " + req.params.collection + " found.";
    res.render("message", {title: "Trivia Game", obj: message});
  });
}

updateUser = function(req, res){
  if(!req.body.update) {
    res.render("message", {title: "Trivia Game", obj: "No update operation defined"});
    return;
  }

  var filter = req.body.find ? JSON.parse(req.body.find) : {};
  var update = JSON.parse(req.body.update);

  userModel.update(filter, update, function(status){
    res.render("message", {title: "Trivia Game", obj: status});  
  });
}

deleteUser = function(req, res){
  if(!req.body.delete) {
    res.render("message", {title: "Trivia Game", obj: "No delete operation defined"});
    return;
  }

  var filter = req.body.find ? JSON.parse(req.body.find) : {};

  userModel.delete(filter, function(status){
    res.render("message", {title: "Trivia Game", obj: status});  
  });
}

createReminder = function(req, res) {
  if (Object.keys(req.body).length == 0) {
    res.render("message", {title: "Trivia Game", obj: "No create body found"});
    return;
  }

  reminderModel.create(req.body, function(result) {
    var success = (result ? "Create Successful" : "Create unsuccsessful");
    res.render("message", {title: "Trivia Game", obj: success});
  });
}

retrieveReminder = function(req, res) {
  reminderModel.retrieve(req.query, function(data) {
    if (data.length) {
      res.render("results", {title: "Trivia Game", obj: data})
    }

    var message = "No documents with "+JSON.stringify(req.query)+
                  " in collection " + req.params.collection + " found.";
    res.render("message", {title: "Trivia Game", obj: message});
  });
}

updateReminder = function(req, res){
  if(!req.body.update) {
    res.render("message", {title: "Trivia Game", obj: "No update operation defined"});
    return;
  }

  var filter = req.body.find ? JSON.parse(req.body.find) : {};
  var update = JSON.parse(req.body.update);

  reminderModel.update(filter, update, function(status){
    res.render("message", {title: "Trivia Game", obj: status});  
  });
}

deleteReminder = function(req, res){
  if(!req.body.delete) {
    res.render("message", {title: "Trivia Game", obj: "No delete operation defined"});
    return;
  }

  var filter = req.body.find ? JSON.parse(req.body.find) : {};

  reminderModel.delete(filter, function(status){
    res.render("message", {title: "Trivia Game", obj: status});  
  });
}