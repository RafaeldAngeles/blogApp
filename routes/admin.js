const express = require('express');
const router = express.Router()

router.get("/", (req, res) => {
    res.render("admin/index"); // Certifique-se de que "admin/index" existe na pasta views
});

router.get('/posts', (req, res) => {
    res.send("Página de posts")
})

router.get('/categorias', (req, res) => {
    res.send("Página de categorias")
})


module.exports = router