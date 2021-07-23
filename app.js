const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

//to provide our path for our static files
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  // console.log(req.body);

  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  //turn it into a flatpack json data, and this is what we gonna send to mail chimp
  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/0273c24da5";

  const options = {
    method: "POST",
    auth: "Una1:bc1cb18c1a67289be63bd326a2bae209-us6"
  }

  //to request data from the url
  const request = https.request(url, options, function(response){

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.send(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });

  })

  request.write(jsonData); //pass the JSON data to the mail chimp server
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
})

//API key
//bc1cb18c1a67289be63bd326a2bae209-us6

//List id
//0273c24da5
