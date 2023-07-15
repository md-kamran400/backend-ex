const express = require("express")
const mongoose = require("mongoose")


const userRouter = require("./routes/user.route")
const bookRouter = require("./routes/book.routes")
const app = express();

app.use(express.json())

app.use("/users", userRouter);
app.use("/books", bookRouter)



const connect = async() => {
    try {
        await mongoose.connect("mongodb+srv://ka5452488:mongodb123@cluster0.10yjjlt.mongodb.net/users?retryWrites=true&w=majority")
        console.log("connected")
    } catch (error) {
        console.log(error)
    }
}

app.listen(3000, () => {
    connect()
    console.log("Server is running on port 3000");
  });









  