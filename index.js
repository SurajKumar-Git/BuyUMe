import express, { json } from "express";
import mongoose from "mongoose";
import Product from "./product.js";

// Mongoose connnection
mongoose.connect("mongodb://127.0.0.1:27017/buyume");

const db = mongoose.connection;

db.on("error", () => {
  console.log("Error in connecting to db");
});

db.once("open", () => {
  console.log("DB Connected successfully");
});

const app = express();
app.use(express.json());

app.post("/product/update", async (req, res) => {
  let products = req.body;
  let jsonResponse = {};
  for (let product of products) {
    try {
      let productObject = await Product.findById(product.id);
      if (!productObject) {
        jsonResponse[product.id] = "Cannot update product, Doesn't exist";
      } else {
        let operation = product.operation;
        if (operation == "add") {
          productObject.quantity += product.quantity;
          await productObject.save();
          jsonResponse[product.id] = "Added quantity succesfully";
        } else if (operation == "subtract") {
          console.log(product);
          if (productObject.quantity < product.quantity) {
            jsonResponse[product.id] = "Cannot update quantity to negative";
          } else {
            productObject.quantity -= product.quantity;
            await productObject.save();
            jsonResponse[product.id] = "Subtracted quantity succesfully";
          }
        } else {
          jsonResponse[product.id] =
            "Invalid operation, Should be add or subtract";
        }
      }
    } catch (error) {
      console.log(error);
      jsonResponse[product.id] = "Cannot update product, Something went wrong";
    }
  }
  res.status(200).json(jsonResponse);
});

async function addProduct() {
  await Product.create({
    productName: "ABC",
    quantity: 10,
  });
  await Product.create({
    productName: "QEWR",
    quantity: 20,
  });
  await Product.create({
    productName: "DGS",
    quantity: 1,
  });
}
// addProduct();

app.listen(3000, () => {
  console.log("Server started on port : 3000");
});
