const express = require("express");
const router = express.Router();
const Article = require("../models/article");
const { ensureAuthenticated } = require("../config/auth");
const article = require("../models/article");

router.get("/new", ensureAuthenticated, (req, res) => {
    res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render("articles/edit", { article: article });
});

router.get("/:slug", async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if(article == null) 
    res.redirect("/")
    res.render("articles/show", { article: article });
});

router.post("/", async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticleAndRedirect("edit"));

router.put("/:id", async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticleAndRedirect("new"));

router.put("/:id", (req, res) => {

});

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/")
});


//comment
router.post("/do-comment", (req, res) => {
    article.collection("articles").update({ "_id": ObjectId(req.body.post_id) }, {
        $push: {
            "comments": {name: req.body.name, comment: req.body.comment}
        }
    }, (error, posts) => {
        if (error) {
            console(error)
        }
            res.send("comment succesfull");
    });
});




function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article

        article.title = req.body.title;
        article.description = req.body.description;
        article.markdown = req.body.markdown;
        try{
            article = await article.save();
            res.redirect(`/articles/${article.slug}`)
        }   catch(e) {
            console.log(e)
            res.render(`articles/${path}`, { article: article })
        }
    }
}



module.exports = router;