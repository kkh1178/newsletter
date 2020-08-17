// Required modules for the app
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
// const { response } = require("express");

// Tell the server to use bodyParser and express
const app = express();
app.use(bodyParser.urlencoded({extended: true}));

// Use this to makes sure that your server can read local css
app.use(express.static("public"));

// app repsonse to get request from browser
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {

    console.log(req)

    // Defining the variables that will allow use to get data off of our website
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",

                // FNAME and LNAME are pulled from the mailchimp audience fields and merge tags
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    
    // Turn our object into a json string.
    const jsonData = JSON.stringify(data);

    console.log(jsonData)

    // Mailchimp base url. I can't find this in the documentation. Replaced the X with 17
    const url = "https://us17.api.mailchimp.com/3.0/lists/39546ec38a";
    const options = {
        method: "POST",
        auth: ""
    }
    const request = https.request(url, options, function(response) {
        console.log(response.statusCode);

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    console.log("REQUEST12: ", request)
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/")
})



// App will listen for requests on portr 3000
app.listen(3000, function() {
    console.log("server is running on port 3000.");
});