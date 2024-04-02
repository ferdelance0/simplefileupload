const express = require("express");
const firebase = require("./firebase"); // Import Firebase instance
const {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} = require("firebase/auth");
const auth = getAuth(firebase);
const app = express();
app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userCredential = await createUserWithEmailAndPassword(auth,email,password);
        res.status(201).send("User signed up successfully");

    } catch (error) {
        res.status(400).send(error.message);
    }

});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth,email, password);
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
