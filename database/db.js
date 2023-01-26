const mysql = require("mysql")
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

connection.connect(function (error) {
    if (error) {
        console.log("Error de conexion:", error)
        return
    }
    console.log("Todo correcto con la BD")
    
})

module.exports= connection;