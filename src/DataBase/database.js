const mongoose = require("mongoose");

mongoose.connect(process.env.Mongo_Url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Succesful");
}).catch((err) => {
    console.log(`${err}`);
});