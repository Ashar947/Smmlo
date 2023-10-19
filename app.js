require('dotenv').config();
const express = require('express');
require('./src/DataBase/database')
const app = express();
app.use(express.json());
const PORT = process.env.PORT;


// app.get('/',(req,res)=>{
//     try {
//         res.status(200).json({message:"Running"});
//     } catch (error) {
//         res.status(404).json({message:error.message});
//     }
// });


const Product = require('./src/Models/productModel')




app.get('/', async (req, res) => {
    try {
      const category_id = "6530e21f4088affc046c2407";
      const product_id = "65314f2b59b84ff7e61f6538";
  
      // Use the $pull operator to remove the product from the array
      const updatedProd = await Product.findOneAndUpdate(
        { _id: category_id },
        { $pull: { products: { _id: product_id } } },
        { new: true }
      );
  
      if (updatedProd) {
        res.send(updatedProd);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  


app.get('/find',async(req,res)=>{
    try {
        const products = await Product.find();
        res.send(products)
    } catch (error) {
        res.status(404).json(error)
    }
})



const user_routes = require('./src/Routes/userRoutes');
const admin_routes = require('./src/Routes/adminRoutes');


app.use('/api/user',user_routes);
app.use('/api/admin',admin_routes);

app.listen(PORT,()=>{
    console.log(`Server listening at http://localhost:${PORT}`)
});
