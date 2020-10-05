const connectionString =
  "mongodb+srv://madcatter:madcatter@cluster0.gjo41.mongodb.net/angulardb?retryWrites=true&w=majority";
const express = require("express");
const bodyParser = require("body-parser");
const { Mongoose } = require("mongoose");
const User = require("./models/users");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const connector = mongoose
  .connect(connectionString)
  .then(() => console.log("Mongoose up"));

app.use(
  session({
    secret: "cathat",
    cookie: {},
  })
);

mongoose.Promise = Promise;

app.use(bodyParser.json());

//Leesa's try at retrieving info
// app.get("/api/user/:email", async (req, res) => {
//   const email = req.params.email;
//   console.log(email);
//   const resp = await User.find({email : email});
//   if (!resp) {
//     //console.log("incorrect details");
//     res.json({
//       success: false,
//       message: "Incorrect details",
//     });
//   } else {
//     res.send(resp);
//     res.json({
//       success: true,
//     });
//     console.log("user found");
//   }
//   //res.send("XXX")
// });

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const resp = await User.findOne({ email, password });
  if (!resp) {
    //console.log("incorrect details");
    res.json({
      success: false,
      message: "Incorrect details",
    });
  } else {
    res.json({
      success: true,
    });
    req.session.user = email;
    req.session.save();
    console.log("logging you in");
  }
  //res.send("XXX")
});

app.get("/api/isloggedin", (req, res) => {
  res.json({
    status: !!req.session.user,
  });
});

app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.json({
      success: false,
      message: "Email already in use",
    });
    return;
  }

  const user = new User({
    email,
    password,
  });
  const result = await user.save();
  console.log(result);
  res.json({
    success: true,
    message: "Welcome!",
  });
});

app.get("/api/data", async (req, res) => {
  const user = await User.findOne({ email: req.session.user });

  if (!user) {
    res.json({
      status: false,
      message: "User was deleted",
    });
    return;
  }

  res.json({
    status: true,
    email: req.session.user,
    total: user.total,
  });
});

app.get("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({
    success: true,
  });
});

app.post("/api/total", async (req, res) => {
  console.log(req.session.user, req.body.value);
  const user = await User.findOne({ email: req.session.user });
  if (!user) {
    res.json({
      success: false,
      message: "Invalid user!",
    });
    return;
  }

  await User.update(
    { email: req.session.user },
    { $set: { total: req.body.value } }
  );
  res.json({
    success: true,
  });
});

app.listen(12345, () => console.log("Server listening at 12345"));

// curl --header "Content-Type: application/json" --request POST --data '{"email":"cat1","password":"mad1"}' http://localhost:12345/api/login