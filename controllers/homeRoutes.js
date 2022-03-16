const router = require("express").Router();
const { BlogPost, Author, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async(req, res) => {
    try { // Get blog posts to join with author data
        const blogPostData = await BlogPost.findAll({
            include: [{
                model: Author,
                attributes: ["name"],
            }, ],
        });

        // Serialize data to allow the template to read it
        const blogposts = blogPostData.map((blog) => blog.get({ plain: true }));

        // Pass serialized data plus session flag to template
        res.render("homepage", {
            blogposts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/blog/:id", async(req, res) => {
    try {
        const blogPostData = await BlogPost.findByPk(req.params.id, {
            include: [{
                    model: Author,
                    attributes: ["name"],
                },
                {
                    model: Comment,
                    attributes: ["comment_content", "date_created", "author_id"],
                    include: [{
                        model: Author,
                        attributes: ["name"],
                    }, ],
                },
            ],
        });

        // Serialize data for handlebars template
        const blog = blogPostData.get({ plain: true });

        res.render("blogPost", {
            ...blog,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get("/dashboard", withAuth, async(req, res) => {// Use withAuth middleware to prevent access to route
    try {
        const authorData = await Author.findByPk(req.session.user_id, {// Find the logged in user based on the session ID
            attributes: { exclude: ["password"] },
            include: [{ model: BlogPost }],
        });

        const author = authorData.get({ plain: true });

        res.render("dashboard", {
            ...author,
            logged_in: true,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/login", (req, res) => {
    if (req.session.logged_in) {// If already logged in redirect request to different route
        res.redirect("/dashboard");
        return;
    }
    res.render("login");
});

router.get("/signup", (req, res) => {
    if (req.session.logged_in) {// If already logged in redirect request to different route
        res.redirect("/dashboard");
        return;
    }
    res.render("signUp");
});

module.exports = router;