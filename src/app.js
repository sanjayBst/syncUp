const express = require("express");

const app = express();

app.use("/test",(req,res)=>{
  res.send("Hello from test route")  
})
app.use("/hello",(req,res)=>{
  res.send("Hello from hello route")  
})
app.use((req,res)=>{
  res.send("Hello from server")  
})

app.listen(2000, () => {
  console.log("Server is running on port 2000");
});
