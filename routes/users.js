const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// User model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => {
    res.render("login.ejs")
});
// Register Page
router.get("/register", (req, res) => {
    res.render("register.ejs")
});

// Register Handle
router.post("/register", (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Chech required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
    }

    //check password mathc
    if ( password !== password2 ) {
        errors.push({ msg: "Passwords do not match" })
    }

    //check pass length
    if(password.length < 1) {
        errors.push({ msg: "Password should be at least 1 charcter" })
    }

    if(errors.length > 0) {
        res.render("register", {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation passed
        User.findOne({ email: email})
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: "Email is already registered" })
                    res.render("register", {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    // Hash Password
                    bcrypt.genSalt(10, (error, salt) => bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;
                        //Set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                            .then(user => {
                                req.flash("success_msg", "You are now registered and can login")
                                res.redirect("/login");
                            })
                            .catch(error => console.log(error))
                    }))
                }
            })

    }

});



// Login Handle
router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/index",
        failureRedirect: "/users/login",
        failureFlash: true
    })(req, res, next);
});

// Logout Handle
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
})

module.exports = router;
