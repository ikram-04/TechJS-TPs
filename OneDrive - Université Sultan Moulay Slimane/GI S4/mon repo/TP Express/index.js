const express = require("express");
const session = require("express-session");

const booksRouter = require("./routers/books");
const authRouter = require("./routers/auth");

const app = express();
const PORT = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "ADEDUIQDSKLFDSKQMLDKFSDKFLDSMQK",
    resave: false,
    saveUninitialized: false,
  })
);

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method}: ${req.url}`);
  next();
});

// Routers
app.use("/auth", authRouter);
app.use("/books", booksRouter);

app.listen(PORT, () => {
  console.log(`Running Express server on port ${PORT}`);
});