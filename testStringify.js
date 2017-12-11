var s = require("./stringify.js");
var str = +process.argv[2];
s.setString(str)

console.log(s.getString(str));
console.log(s.getString + " randomized is " + s.randomizeString());
console.log("Hello World" + " randomized is " + s.randomizeString("Hello World"));