const mongoose = require('mongoose');
require('dotenv').config();
const mongooseAutoIncrement = require('mongoose-auto-increment');
mongooseAutoIncrement.initialize(mongoose.connection);

const productsSchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true
  },
  products: [
    {
      product_id: {
        type: Number,
        required: true,
        plugin: mongooseAutoIncrement.plugin,
        field: 'product_id',
        unique:true,
      },
      product_name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      min_order: {
        type: Number,
        required: true,
      },
      max_order: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      favourite_users: [
        {
          users: {
            type: String
          }
        }
      ],
    }
  ]
});


module.exports = mongoose.model('Products', productsSchema);





// favourite_users:[
//     {
//         users:{
//             type:String
//         }
//     }
// ]