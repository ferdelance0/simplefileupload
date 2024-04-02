const express = require("express");
const firebase = require("./firebase"); 
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} = require("firebase/auth");
const auth = getAuth(firebase);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use("/public", express.static("public"));


app.get("/", (req, res) => {
  res.render("login",{ errorMessage: null });
});
// Signup route
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userCredential = await createUserWithEmailAndPassword(auth,email,password);
        res.status(201).send(userCredential.user.uid);

    } catch (error) {
        res.render("login", { errorMessage: error.message });
    }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth,email, password);
    res.status(200).send(userCredential);
  } catch (error) {

    res.render("login", { errorMessage: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
