const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

// ✅ allow React Native app to talk to this server
app.use(
  cors({
    origin: true,             // allow all origins for dev
    credentials: true,        // allow cookies
  })
);

// fake login endpoint
app.post("/login", (req, res) => {
  // in real apps: validate username/password
  res.cookie("sessionid", "abc123", {
    httpOnly: true,   // 🔒 JS cannot read
    secure: true,     // 🔒 only over HTTPS
    sameSite: "lax"
  });
  res.json({ message: "Logged in successfully ✅" });
});

// protected endpoint
app.get("/protected", (req, res) => {
  const { sessionid } = req.cookies;
  if (sessionid === "abc123") {
    res.json({ data: "Super secret data 🚀" });
  } else {
    res.status(401).json({ error: "Unauthorized ❌" });
  }
});

// health check
app.get("/", (req, res) => res.send("Cookie Auth Demo API running 🍪"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
