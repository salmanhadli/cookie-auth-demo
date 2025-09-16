const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS: allow cookies
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Fake login page (simple HTML form)
app.get("/login", (req, res) => {
  res.send(`
    <html>
      <body>
        <h2>Login Page</h2>
        <form method="POST" action="/do-login">
          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

// POST login (sets cookie + redirects)
app.post("/do-login", (req, res) => {
  res.cookie("sessionid", "abc123", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });
  // 🔥 Important: redirect to /auth/success so WebView detects login
  res.redirect("/auth/success");
});

// Redirect target
app.get("/auth/success", (req, res) => {
  res.send("<h2>Login successful! You can now close this page.</h2>");
});

// Protected endpoint
app.get("/protected", (req, res) => {
  const { sessionid } = req.cookies;
  if (sessionid === "abc123") {
    res.json({ data: "Super secret data 🚀" });
  } else {
    res.status(401).json({ error: "Unauthorized ❌" });
  }
});

// Health check
app.get("/", (req, res) => res.send("Cookie Auth Demo API running 🍪"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
