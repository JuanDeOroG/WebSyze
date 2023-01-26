const express =require("express")
const app= express()

// seteamos para capturar los datos del formulario
app.use(express.urlencoded({extended:false}))
app.use(express.json())


const dotenv= require("dotenv")
dotenv.config({path:"./env/.env"})

app.use("/resources",express.static("public"))
app.use("/resources", express.static(__dirname + "/public"))

// Estableciendo motor de plantillas ejs
app.set("view engine", "ejs")

// BCRYPTJS
const bcryptjs = require("bcryptjs")

// EXPRES SESSION
const session = require("express-session")
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}))

// MODULO DE CONECCION BD

const connection = require("./database/db")


// VISTAS GET
    app.get("/",function (req,res) {
        res.render("index", { msg:"Juan De Ore" })
        
    })

    app.get("/login", function (req, res) {
        res.render("login", { msg: "Juan De Ore" })

    })
    app.get("/register", function (req, res) {
        res.render("register", { msg: "Juan De Ore" })

    })

// Post para insertar nuevo usuario - HACER REGISTRO

app.post("/register",async function (req,res) {
    const nombres = req.body.nombres.toUpperCase()
    const apellidos = req.body.apellidos.toUpperCase()
    const password = req.body.password
    const email = req.body.email.toUpperCase()
    const telefono = req.body.telefono
    const asunto = req.body.asunto.toUpperCase()
    const necesidad = req.body.necesidad.toUpperCase()
    const usuario =req.body.usuario
    let paswordHash= await bcryptjs.hash(password,8)

    connection.query("INSERT INTO usuarios_registrados SET ?", { nombres: nombres, apellidos: apellidos, password: paswordHash, email: email, telefono: telefono, asunto: asunto, necesidad: necesidad, usuario: usuario },async function (error,results) {
        if(error){
            console.log("Error al registrar: ", error)
            res.send("Hubo un error tecnico al momento de intentar realizar el registro bro, revisa avr...")
        }else{
            res.render("registrado")
}   
        
    })
    
})

// Post para iniciar sesion - AUTENTICACIÓN

app.post("/auth",async (req,res)=>{
    const usuario = req.body.usuario
    
    const password = req.body.password

    let paswordHash = await bcryptjs.hash(password,8)

    if (usuario && password){
        connection.query('SELECT * FROM `usuarios_registrados` WHERE usuario ="' + usuario + '"',async function (error, rows,fields) {
            if (rows.length == 0 || !(await bcryptjs.compare(password,rows[0].password))){
                res.send("Usuario o contraseña incorrectas...")
            }else{
                console.log("Se supone que pasó a index, logueo correcto xd")
                res.render("index")
            }
            // console.log("Rows: ",rows)
            // console.log("Error: ", error)
            // console.log("Fields: ", fields)
            
        })
    }

})

// app.post("/datos", async (req, res) => {
//     connection.query('SELECT * FROM `usuarios_registrados`', async function (error, rows, fields) {
//         if (rows.length != 0){
//             res.json(rows)
//         } else {
//             console.log("revisa avr")
            
//         }})
// })


app.listen(3000,(req,res)=>{
    console.log("Corriendo en el puerto 3000...")
})
