var mongo = require('mongodb');
var userModel = require("../models/userModel.js");
var reminderModel = require("../models/reminderModel.js");
const trivia = require("../models/triviaAPI.js")

exports.init = function(app) {
  var passport = app.get('passport');

  app.get("/", checkAuthentication, index);
  app.get("/question/new/:category", checkAuthentication, getNewQuestion);
  app.get("/question/:id", checkAuthentication, displayReminder);
  app.get("/reminders", checkAuthentication, getReminders);
  app.get("/reminder/delete/:id", checkAuthentication, deleteReminder);
  app.post("/reminder/create", checkAuthentication, createReminder);

  app.get("/user/delete", checkAuthentication, deleteUser)
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
  res.render("index", {title: "Trivia Game", categories: trivia.getCategories()})
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
getNewQuestion = function(req, res) {
  trivia.getQuestions(req.session.passport.user.token, req.params.category, function(data) {
    res.render("question", {title: "Trivia Game", 
      question: unescape(data.results[0].question),
      type: data.results[0].type,
      answers: randomizeAnswers(data.results[0]),
      answer: data.results[0].correct_answer,
      category: req.params.category,
      user_id: req.session.passport.user._id,
      reminder: false
    });
  });
}

// Users and Authentication
createUser = function(req, res) {
  if (Object.keys(req.body).length == 0) {
    res.render("message", {title: "Trivia Game", obj: "No create body found"});
    return;
  }

  trivia.getSessionToken(function(result) {
    req.body.token = result;
    userModel.create(req.body, function(result) {
      res.redirect("/login.html");
    });
  });
}

deleteUser = function(req, res){
  var o_id = new mongo.ObjectID(req.session.passport.user._id);

  userModel.delete({"_id": o_id}, function(status){
    res.render("message", {title: "Trivia Game", obj: status});  
  });
}

// Utility Functions
function randomizeAnswers(question) {
  var answers = question.incorrect_answers;
  answers.push(question.correct_answer);
  
  return answers;
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