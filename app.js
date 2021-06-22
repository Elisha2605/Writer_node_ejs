const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");
const indexRouter = require("./routes/index");
const methodeOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
// const passport = require("./config/passport");
const passport = require("passport");
const dotenv = require('dotenv');


const app = express();


dotenv.config({ path: './config.env' });

// Passport config
require("./config/passport")(passport);

const DB = process.env.DATABASE;
const DB_LOCAL = process.env.DATABASE_LOCAL;  


mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

//Express Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect falsh
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    next();
});

app.use(methodeOverride("_method"));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));



// Routes
app.use("/", require("./routes/users"))

app.get("/", async (req, res) => {
    const articles = await Article.find().sort({ createdAT: "desc" })   
    res.render("articles/dashboard", { articles: articles });
});










app.use("/index", indexRouter)
app.use("/users", usersRouter)
app.use("/articles", articlesRouter);

const port = process.env.PORT || 8080;

app.listen(port, (error) => {
    if (error) {
        console.log(error)
    }
    console.log("Server running on port", port);
});