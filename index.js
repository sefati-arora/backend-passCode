const express=require("express")
const app=express();
const PORT=4002;
const cors = require("cors");
app.use(cors("*"));
const fileUpload= require("express-fileupload");
const path=require("path");
const connectdb=require('./config/connectdb')
require('./models/index')
const router=require('./router/userRouter')
app.use("/images", express.static(path.join(__dirname, "public/images")));
 app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
connectdb.connectdb();
app.use('/api',router);
app.get('/',(req,res)=>
{
    res.send("SERVER CREATED FOR TASK!")
})

app.listen(PORT,()=>
{
    console.log(`server created at http://localhost:${PORT}`)
})

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU2YmI5NTA1LTA1MmEtNDk2My1iNGVlLTdiYjgyNDJhZjAwOSIsImlhdCI6MTc3MDI5NDQ2NX0.ybyh2Qzhz5Uc8Sz-iTjoOWW2T5hjU_BOsU49yIIKRs8