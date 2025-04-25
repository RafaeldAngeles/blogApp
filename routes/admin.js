const { text } = require("body-parser");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("Página de posts");
});

router.get("/categorias", (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .then((Categoria) => {
      res.render("admin/categorias", { Categorias: Categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias!");
    });
});

router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategorias");
});

router.post("/categorias/nova", (req, res) => {
  var erros = [];

  if (
    !req.body.nome ||
    typeof req.body.nome === undefined ||
    req.body.nome == null
  ) {
    erros.push({ texto: "Nome inválido" });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug === undefined ||
    req.body.slug == null
  ) {
    erros.push({ texto: "slug inválido" });
  }

  if (req.body.nome.length < 2) {
    erros.push({ texto: "Nome da categoria é muito pequeno" });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", { erros: erros });
  } else {
    const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug,
    };

    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria Criada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Hove um erro ao salvar a categoria, tente novamente!"
        );
        res.redirect("/admin");
      });
  }
});

router.get("/categorias/edit/:id", (req, res) => {
  Categoria.findOne({ _id: req.params.id })
    .then((Categoria) => {
      res.render("admin/editCategorias", { Categoria: Categoria });
    })
    .catch((err) => {
      req.flash("error_msg", "Essa categoria não existe");
      res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit", (req, res) => {
  let errosEdit = [];
  if (
    !req.body.nome ||
    typeof req.body.nome === undefined ||
    req.body.nome == null
  ) {
    errosEdit.push({ texto: "Nome inválido" });
  }

  if (
    !req.body.nome ||
    typeof req.body.nome === undefined ||
    req.body.nome == null
  ) {
    errosEdit.push({ texto: "Slug inválido" });
  }

  if (req.body.nome && req.body.nome.length < 2) {
    errosEdit.push({ texto: "Nome da categoria é muito pequeno" });
  }

  if (errosEdit.length > 0) {
    res.render("admin/editCategorias", {
      erros: errosEdit,
      Categoria: req.body,
    });
  } else {
    Categoria.findOne({ _id: req.body.id })
      .then((categoria) => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        return categoria.save();
      })
      .then(() => {
        req.flash("success_msg", "Categoria editada com sucesso!");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash(
          "error_msg",
          "Houve um erro ao salvar a categoria. Tente novamente!"
        );
        res.redirect("/admin/categorias");
      });
  }
});

router.post("/categorias/deletar", (req, res) => {
  Categoria.deleteOne({ _id: req.body.id })
    .then(() => {
      req.flash("success_msg", "Categoria deletada com sucesso!");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria!");
      res.redirect("/admin/categorias");
    });
});

module.exports = router;
