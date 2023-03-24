const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

mongoose.connect("mongodb://localhost:27017/loginRegistrationDB", options, (err) => {
    if (!err) {
        console.log("DB connected");
    } else {
        console.log("Error")
    }
});

const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    phonenumber: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// Routes
app.get("/", (req, res) => {
    res.send("Welcome")
})

app.post("/login", (req,res) => {
    const {loginemail, loginpassword} = req.body
    // console.log(req.body)
    // console.log(loginemail, loginpassword)
    User.findOne({email: loginemail}, (err, user) => {
        if(user) {
            if(loginpassword === user.password) {
                res.status(200).send({message: "Login Successful", user: user})
            } else {
                res.send({message: "Invalid email or password"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
})

app.post("/register", (req, res) => {
    const {firstname, lastname, phonenumber, email, password} = req.body
    // console.log(firstname, lastname, phonenumber, email, password)
    // console.log(req.body)

    User.findOne({email}, (err, user) => {
        if(user) {
            res.send({message: "User already registerd"})
        } else {
            const user = new User({
                firstname,
                lastname,
                phonenumber,
                email,
                password
            })
            user.save((err) => {
                if(err) {
                    res.send(err)
                } else {
                    res.status(200).send({message: "Successfully Registered, Please login now."})
                }
            })
        }
    })
})

app.listen(9002, () => {
    console.log("Server is up and running on port 9002")
})