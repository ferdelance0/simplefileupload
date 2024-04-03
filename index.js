const express = require("express");
const session = require("express-session");
const path = require("path");
const firebase = require("./firebase");
const adminController = require("./controller/adminController");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const auth = getAuth(firebase);
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");
const storage = getStorage(firebase);

const { getFirestore, collection, addDoc, query, where, getDocs } = require("firebase/firestore");
const db = getFirestore();

const mutler = require("multer");
const upload = mutler({ storage: mutler.memoryStorage() });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use("/public", express.static("public"));
app.use(session({
  secret: 'As23e1213',
  resave: false,
  saveUninitialized: true
}));

app.get("/", (req, res) => {
  res.render("login", { msg: null });
});
app.get("/dashboard", adminController.isAuthenticated, async (req, res) => {
  try {
    const { email, uid } = req.session.user;
    const q = query(collection(db, uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

    res.render("dashboard", { email, uid, querySnapshot });
  } catch (error) {
    console.log(error);
  }
});


// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.render("login", { msg: "" });
  } catch (error) {
    res.render("login", { msg: adminController.extractErrorCode(error) });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    req.session.user = { email, uid: userCredential.user.uid };
    res.redirect("/dashboard")

  } catch (error) {
    res.render("login", { msg: adminController.extractErrorCode(error) });
  }
});
app.get("/logout", async(req, res) => {
  try{
    await auth.signOut();
    req.session.destroy();
    res.redirect("/")
  }
    catch(error) {
      console.error("Error signing out:", error);
      res.status(500).json({ success: false, message: "Logout failed" });
    };
});

app.post("/store", upload.single("filename"), async (req, res) => {
  try {
    console.log(req.session.user.uid);
    const storageRef = ref(storage, `files/${req.file.originalname}`)
    const metadata = {
      contentType: req.file.mimetype,
    }
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    id = req.session.user.uid;
    const userDocRef = await addDoc(collection(db, id),
      {
        metadata: {
          contentType: req.file.mimetype,
          file_name: req.file.originalname
        },
        downloadURL: downloadURL,
      });
    console.log("done");
    res.redirect("/dashboard");
  }
  catch (error) {
    console.error(error);
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
