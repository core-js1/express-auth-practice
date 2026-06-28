const express = require("express");
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const connectDB = require("./database");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let db;

(async () => {
    db = await connectDB();

    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
})();

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await db.get(
        "SELECT * FROM users WHERE username = ?",
        username
    );

    if (existingUser) {
        return res.json({
            success: false,
            message: "An account with that username already exists!"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        username,
        hashedPassword
    );

    res.json({
        success: true
    });
});


app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await db.get(
        "SELECT * FROM users WHERE username = ?",
        username
    )

    if (!user) {
        return res.send("Invalid username or password!")
    }

    const matches = await bcrypt.compare(password, user.password)

    if (!matches) {
        return res.send("Invalid username or password!")
    }

    res.send("Logged in!")

})

