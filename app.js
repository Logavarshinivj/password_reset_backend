const express=require("express")
const app = express()
const mongoose=require("mongoose")
const cors=require("cors")
var nodemailer = require('nodemailer');
const dotenv=require("dotenv")
app.use(cors(
    {
        origin: '*'      
      }
))
app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))
dotenv.config()
const PORT=4000


mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Mongodb connected"))
.catch(err=>console.log("Error connecting"))


app.use("/",require("./Routes/userRoute"))
app.listen(PORT,()=>{
    console.log(`Server started running on port ${PORT}🔥🔥`)
})