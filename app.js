var morgan = require("morgan");
var fs = require("fs");
var path = require("path");
var bodyParser = require("body-parser");

var express = require("express");
var app = express();

app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

fs.readdirSync("./routes").forEach(function (file){
    if(path.extname(file)==".js") {
        require("./routes/" + file).init(app);
    }
});


app.use(function(req, res){
    var message = "Error, did not understand path " + req.path;
    res.status(404).render("error", {"message": message});
});

var httpServer = require("http").createServer(app);

httpServer.listen(50000, function() {
    console.log("Listening on port " + this.address().port);
});