const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const dbo = require("./db");
const ObjectID = dbo.ObjectID;

app.engine(
  "hbs",
  exhbs.engine({ layoutsDir: "views/", defaultLayout: "main", extname: "hbs" })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: true }));
let edit_id, edit_book;
app.get("/", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  const cursor = collection.find({});

  let employees = await cursor.toArray();
  // console.log(employees);

  let message = "";

  if (req.query.edit_id) {
    edit_id = req.query.edit_id;
    edit_book = await collection.findOne({ _id: new ObjectID(edit_id) });
    console.log(edit_book);
  }

  if (req.query.delete_id) {
    await collection.deleteOne({ _id: new ObjectID(req.query.delete_id) });
    return res.redirect("/?status=3");
  }

  switch (req.query.status) {
    case "1":
      message = "inserted successfully";
      break;
    case "2":
      message = "updated successfully";
      break;
    case "3":
      message = "Deleted successfully";
      break;
    default:
      break;
  }
  res.render("main", { message, employees, edit_id, edit_book });
});

app.post("/store_book", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  let book = { title: req.body.Title, author: req.body.Author };
  await collection.insertOne(book);
  return res.redirect("/?status=1");
});

app.post("/update_book/:edit_id", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  let book = { title: req.body.Title, author: req.body.Author };
  await collection.updateOne({ _id: new ObjectID(edit_id) }, { $set: book });
  return res.redirect("/?status=2");
});

app.listen(3000, () => {
  console.log("port listening");
});
