const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");

// Configurações 
    app.use(session({
        secret: "pjNode",
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())

//middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next()
})

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Handlebars
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

//mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp").then(() => {
        console.log("Conexão feita com sucesso!")
    }).catch((error) => {
        console.log("Erro ao se conectar com o bando dados: "+error)
    })


//public

app.use(express.static(path.join(__dirname, "public")))

// Rotas 
app.use("/admin",admin)


// Outros

const PORT = 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando!");
});
