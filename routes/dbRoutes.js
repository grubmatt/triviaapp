var mongo = require('mongodb');

var userModel = require("../models/userModel.js");
var reminderModel = require("../models/reminderModel.js");
const trivia = require("../models/triviaAPI.js")
var token = "";

exports.init = function(app) {
  var passport = app.get('passport');

  app.get("/", checkAuthentication, index);
  app.get("/question", checkAuthentication, getQuestion);
  app.get("/question/:id", checkAuthentication, displayReminder);
  app.get("/reminders", checkAuthentication, getReminders);
  app.get("/reminder/delete/:id", checkAuthentication, deleteReminder);
  app.post("/reminder/create", checkAuthentication, createReminder);

  app.post("/user/create", createUser);
  app.post("/login",
    passport.authenticate("local", {
      failureRedirect: "/login.html",
      successRedirect: "/"
    })
  );
  app.get("/logout", checkAuthentication, doLogout);
}

index = function(req, res) {
  res.render("index", {title: "Trivia Game"})
}

// Reminders
getReminders = function(req, res) {
  reminderModel.retrieve({"user_id": req.session.passport.user._id}, function(data) {
    res.render("reminders", {title: "Trivia Game", reminders: data})
  });
}

createReminder = function(req, res) {
  if (Object.keys(req.body).length == 0) {
    res.render("message", {title: "Trivia Game", obj: "No create body found"});
    return;
  }

  reminderModel.create(req.body, function(result) {
    console.log(result ? "Create Successful" : "Create unsuccsessful");
  });
}

deleteReminder = function(req, res) {
  var o_id = new mongo.ObjectID(req.params.id);

  reminderModel.delete({"_id": o_id}, function(status){
    console.log(status);
    res.redirect("/reminders");
  });
}

displayReminder = function(req, res) {
  var o_id = new mongo.ObjectID(req.params.id);

  reminderModel.retrieve({"_id": o_id}, function(reminder) {
    res.render("question", {title: "Trivia Game", 
      question: unescape(reminder[0].question),
      type: reminder[0].type,
      answers: reminder[0].answers.split(","),
      answer: reminder[0].correct_answer,
      category: reminder[0].category,
      user_id: req.session.passport.user._id,
      reminder: true
    });
  });
}

// Questions
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
      category: req.query.category,
      user_id: req.session.passport.user._id,
      reminder: false
    });
  });
}

function randomizeAnswers(question) {
  var answers = question.incorrect_answers;
  answers.push(question.correct_answer);
  
  return answers;
}

// Users and Authentication
createUser = function(req, res) {
  if (Object.keys(req.body).length == 0) {
    res.render("message", {title: "Trivia Game", obj: "No create body found"});
    return;
  }

  userModel.create(req.body, function(result) {
    res.redirect("/login.html");
  });
}

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login.html");
  }
}

function doLogout(req, res) {
  req.logout();
  res.redirect("/login.html");
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