const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  // Check for the JWT token in the request header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, "your_secret_key_here");
    // Attach the authenticated user information to the request object
    req.user = decoded;
    // Proceed to the next middleware
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid token. Please log in again." });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
