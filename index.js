const express = require("express");
const session = require("express-session");
const path = require("path");
const cors = require("cors");

const mutler = require("multer");
const firebase = require("./firebase");
const adminController = require("./controller/adminController");

const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { getStorage, ref, getDownloadURL, uploadBytesResumable,deleteObject } = require("firebase/storage");
const { getFirestore, collection, addDoc, query, getDocs,getDoc, deleteDoc, doc } = require("firebase/firestore");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const auth = getAuth(firebase);
const storage = getStorage(firebase);
const db = getFirestore();
const upload = mutler({ storage: mutler.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use("/public", express.static("public"));

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    res.json({ status: "success" });
  } catch (error) {
    res.json({ status: adminController.extractErrorCode(error) });
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    res.json({ status: "success", email: email, uid: userCredential.user.uid });
  } catch (error) {
    res.json({ status: adminController.extractErrorCode(error) });
  }
});

//dashboard route
app.get("/dashboard", async (req, res) => {
  try {
    const { email, uid } = req.query;
    const q = query(collection(db, uid));
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const docId = doc.id; 
      docData.id = docId;
      documents.push(docData);

    });
    res.json({ email, uid, documents });
  } catch (error) {
    res.json({ status: error });
  }
});

//logout route
app.get("/logout", async (req, res) => {
  try {
    await auth.signOut();
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error signing out:", error);
    res.json({ status: error });
  }
});

//file upload route
app.post("/store", upload.single("filename"), async (req, res) => {
  try {
    const uid = req.body.uid;
    const storageRef = ref(storage, `files/${uid}/${req.file.originalname}`);
    const metadata = {
      contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const userDocRef = await addDoc(collection(db, uid), {
      metadata: {
        contentType: req.file.mimetype,
        file_name: req.file.originalname,
      },
      downloadURL: downloadURL,
    });
    console.log("File uploaded successfully");
    res.json({ status: "success" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.json({ status: error });
  }
});

//file delete route
app.post("/delete", async (req, res) => {
  const { fileId, uid } = req.body.params;

  try {
    const docRef = doc(db, uid, fileId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const fileData = docSnapshot.data();
      const fileName = fileData.metadata.file_name;

      const storageRef = ref(storage, `files/${uid}/${fileName}`);
      await deleteObject(storageRef);

      await deleteDoc(docRef);

      return res.json({ status: "success" });
    } else {
      return res.json({ status: "error", message: "Document not found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: error });
  }
});

//truncate table route
app.post("/truncate", async (req, res) => {
  const { uid } = req.body.params;
  try {
    const collectionRef = collection(db, uid);
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);

    const deletePromises = [];
    const storagePromises = [];

    querySnapshot.forEach((doc) => {
      const docId = doc.id;
      const docData = doc.data();
      const fileName = docData.metadata.file_name;

      const deletePromise = deleteDoc(doc.ref);
      deletePromises.push(deletePromise);

      const storageRef = ref(storage, `files/${uid}/${fileName}`);
      const storagePromise = deleteObject(storageRef);
      storagePromises.push(storagePromise);
    });
    await Promise.all([...deletePromises, ...storagePromises]);
    return res.json({ status: "success" });
  } catch (error) {
    console.log(error);
    return res.json({ status: "error" });
  }
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
