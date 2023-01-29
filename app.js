const express = require("express")
const app = express()
const mailer = require("nodemailer")

// seteamos para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }))
app.use(express.json())


const dotenv = require("dotenv")
dotenv.config({ path: "./env/.env" })

app.use("/resources", express.static("public"))
app.use("/resources", express.static(__dirname + "/public"))

// Estableciendo motor de plantillas ejs
app.set("view engine", "ejs")

// BCRYPTJS
const bcryptjs = require("bcryptjs")

// EXPRES SESSION
const session = require("express-session")
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

// MODULO DE CONECCION BD

const connection = require("./database/db")


// VISTAS GET


app.get("/login", function (req, res) {
    let sesion = "indefinido"

    res.render("login", {sesion:"indefinido"}
)

})
app.get("/register", function (req, res) {
    res.render("register", { msg: "Juan De Ore" })

})
app.get("/passReset", function (req, res) {
    res.render("passReset")

})

// Post para insertar nuevo usuario - HACER REGISTRO

app.post("/register", async function (req, res) {
    const nombre = req.body.nombre.toUpperCase()
    const password = req.body.contraseña
    const email = req.body.email.toUpperCase()
    const telefono = req.body.telefono
    const asunto = req.body.asunto.toUpperCase()
    const mensaje = req.body.mensaje.toUpperCase()

    let paswordHash = await bcryptjs.hash(password, 8)

    connection.query("INSERT INTO usuarios_registrados SET ?", { nombre: nombre, password: paswordHash, email: email, telefono: telefono, asunto: asunto, mensaje: mensaje }, async function (error, results) {
        if (error) {
            console.log("Error al registrar: ", error)
            res.send("Hubo un error tecnico al momento de intentar realizar el registro bro, revisa avr...")
        } else {
            res.render("registrado")
        }

    })

})

// Post para iniciar sesion - AUTENTICACIÓN
app.get("/", function (req, res) {
    
    if (req.session.loggedin) {
        res.render("index", { login: true, name: req.session.name })
    } else {
        res.render("index", { login: false, name: "debe iniciar sesión"})

    }

})

app.post("/auth", async (req, res) => {
    const nombre = req.body.nombre

    const password = req.body.password

    let paswordHash = await bcryptjs.hash(password, 8)

    if (nombre && password) {
        connection.query('SELECT * FROM `usuarios_registrados` WHERE nombre ="' + nombre + '"', async function (error, rows, fields) {
            if (rows.length == 0 || !(await bcryptjs.compare(password, rows[0].password))) {
                res.send("Usuario o contraseña incorrectas...")
            } else {
                req.session.loggedin=true
                name_user = req.session.name = rows[0].nombre
                console.log("Se supone que pasó a index, logueo correcto xd")
                let sesion = "definido"

                res.render("login",{login:true,name_user,sesion:sesion})
            }
            // console.log("Rows: ",rows)
            // console.log("Error: ", error)
            // console.log("Fields: ", fields)

        })
    }else{
        res.send("Por favor, ingresar datos en los campos del login <a href='/login'>Ir a Login<a>")
    }

})


// POST para mandar correo de solicitud de cambio de contraseña

app.post("/passReset", async function (req, res) {



    const enviarMail = async function () {
        const usuario = req.body.usuario
        const telefono = req.body.telefono
        const correo = req.body.correo
        const mensajeText = req.body.mensaje
        config = {
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: "mapacheblanco4@gmail.com",
                pass: "riyslicoabfwztqi"
            },
            tls: {
                rejectUnauthorized: false
            }
        }

        const transporte = mailer.createTransport(config)

        const mensaje = {
            from: "mapacheblanco4@gmail.com",
            to: "mapacheblanco4@gmail.com",
            subject: "Contraseña solicitada de " + usuario,
            text: mensajeText + ". Información: correo mandado con el telefono: " + telefono + " y con el correo: " + correo
        }

        const info = await transporte.sendMail(mensaje);

    }

    enviarMail();

    res.render("login")




})


//LOGOUT CERRAR SESIón

app.get("/logout",function (req,res) {

    req.session.destroy(function () {
        res.redirect("/")
        
    })
    
})

// app.post("/datos", async (req, res) => {
//     connection.query('SELECT * FROM `usuarios_registrados`', async function (error, rows, fields) {
//         if (rows.length != 0){
//             res.json(rows)
//         } else {
//             console.log("revisa avr")

//         }})
// })




app.listen(3000, (req, res) => {
    console.log("Corriendo en el puerto 3000...")
})
