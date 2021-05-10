const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

console.log(date());

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");



///////////////////////////////////

mongoose.connect("mongodb+srv://admin-Yash:Yash1234@cluster0.9czsv.mongodb.net/toDoList?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

const todoSchema = mongoose.Schema({
  name: String
})

const TodoModel = mongoose.model("work",todoSchema)

var items = ["Buy Food", "cook food", "eat food"];
var workItems = [];

const item1 = new TodoModel({
  name: "welcome to your TodoList"
});
const item2 = new TodoModel({
  name: "Click + to add"
});
const item3 = new TodoModel({
  name: "<--- click to delete"
});

const defaultItem = [item1, item2, item3];

const userChoiceSchema = {
  name: String,
  items: [todoSchema]
};

const UserModel = mongoose.model("list", userChoiceSchema);




// const showDB = Todomodel.find()

app.get("/", function (req, res) {
  //   const day = date.getDay();
  //   let printday;
  //   switch (day) {
  //     case 0:
  //       printday = "sunday";
  //       break;
  //     case 1:
  //       printday = "monday";
  //       break;
  //     case 2:
  //       printday = "tuesday";
  //       break;
  //     case 3:
  //       printday = "wednesday";
  //       break;
  //     case 4:
  //       printday = "thursday";
  //       break;
  //     case 5:
  //       printday = "friday";
  //       break;
  //     case 6:
  //       printday = "saturday";
  //       break;
  //     default:
  //       console.log("error invalid day");
  //   }
  //   res.render("list", { today: printday });
  TodoModel.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      TodoModel.insertMany(defaultItem, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("success");
        }
      });
      res.redirect("/");
    }
    else {
      let day = date(); 
      res.render("list", { listTitle: day, listItems: foundItems, buttonValue:"homeRoute" });
    }
    
  });
  
});

app.post("/", function (req, res) {
  console.log(req.body);

  const itemName = req.body.newItem;
  const item = new TodoModel({
    name: itemName
  });

  if (req.body.submitButton === "homeRoute") {
    item.save();
    res.redirect("/")
  }
  else {
    UserModel.findOne({ name: req.body.submitButton }, function (err, found) {
      if (!err) {
        if (found) {
          found.items.push(item);
          found.save();
          res.redirect("/"+req.body.submitButton);
        }
      }
    });
  }
  
  
  
});

app.post("/delete", function (req, res) {
  console.log("inside delete")
  const idDel = req.body.checkBox;
  const listName = req.body.hide;
  // console.log(req.body.hide);
  if (listName === "homeRoute") {
    TodoModel.findByIdAndRemove(idDel, (err) => {
      if (err) {
        console.log("error during deletion");
      }
      else {
        console.log("success in deletion");
      }
     
    }, { new: true, useFindAndModify: false });
    res.redirect("/");
  } else {
    UserModel.findOneAndUpdate({ name: listName }, {$pull:{items:{_id:idDel}}}, function (err, foundOne) {
      if (!err) {
        res.redirect("/"+listName)
      }
    },{new: true, useFindAndModify: false}
    );
  }
});

// app.get("/work", function (req, res) {
//   res.render("list", {
//     listTitle: "Work List",
//     listItems: workItems,
//     listName: "work",
//   });
// });

// app.get("/about", function (req, res) {
//   res.render("about");
// });
// app.post("/work", function (req, res) {
//   console.log(req.body);
// });

app.get("/:userChoice", function (req, res) {
  const choice = req.params.userChoice;
  
  UserModel.findOne({ name: choice }, function (err, found) {
    if (!err) {
      if (!found) {
        // create new list
        
        const list = new UserModel({
          name: choice,
          items: defaultItem
        });
        list.save();
        res.redirect("/"+choice)
      } else {
        //show existing list
        
        res.render("list", { listTitle: found.name, listItems: found.items, buttonValue:found.name})
      }
    }
  })


 

});

let port = process.env.PORT
if (port == null || port == "") {
  port = 5000;
}
app.listen(port || 5000, function () {
  console.log("server establish at port 5000");
});
