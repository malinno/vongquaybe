import express from "express";
const app = express();
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import cors from 'cors'; 
dotenv.config();
const PORT =  5500 ;

app.use(express.json());
app.use(cors());

app.post('/login', (req, res) =>{
    //authentication
    const data = req.body;
    console.log({data})
  const accessToken = jwt.sign(data,process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:'1h',
})
res.json({accessToken});
  
})


app.listen(PORT, () =>{
    console.log(`server listening on ${PORT}`);
});