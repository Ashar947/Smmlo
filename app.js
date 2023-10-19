require('dotenv').config();
const express = require('express');
require('./src/DataBase/database')
const app = express();
app.use(express.json());
const PORT = process.env.PORT;


app.get('/',(req,res)=>{
    try {
        res.status(200).json({message:"Running"});
    } catch (error) {
        res.status(404).json({message:error.message});
    }
});

const user_routes = require('./src/Routes/userRoutes');
const admin_routes = require('./src/Routes/adminRoutes');


app.use('/api/user',user_routes);
app.use('/api/admin',admin_routes);

app.listen(PORT,()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
});
