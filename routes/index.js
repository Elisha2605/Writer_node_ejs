const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const { ensureAuthenticated } = require("../config/auth");

//Welcome Page
router.get("/", ensureAuthenticated, async (req, res) => {
    const articles = await Article.find().sort({ createdAT: "desc" })   
    res.render("articles/index", { articles: articles })
});

module.exports = router;