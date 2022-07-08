const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("article", articleSchema);

//////////////////////// Request targeting all articles ///////////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find({}, function(err, foundArticles) {
      if (!err) res.send(foundArticles);
      else res.send(err);
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) res.send("Successfully added a new Article");
      else res.send(err);
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) res.send("Successfully deleted all articles");
      else res.send(err);
    })
  });

///////////////////// Request targeting particular articles ////////////////////

app.route("/articles/:articleTitle")

  .get(function(req, res) {
      Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(!err)res.send(foundArticle);
        else res.send("No articles matching that title was found");
      })
  })

  .put(function(req,res){
    Article.replaceOne(
      {title: req.params.articleTitle},
      {title: req.body.title, content:req.body.content},
      {overwrite: true},
      function(err){
        if(!err)res.send("Successfully updated article");
        else res.send(err);
      }
    );
  })

  .patch(function(req,res){
    Article.findOneAndUpdate(
      {title: req.params.articleTitle},
      {$set: req.body},
      function(err){
        if(!err)res.send("Successfully updated article");
        else res.send(err);
      }
    )
  })

  .delete(function(req,res){
    Article.findOneAndDelete({title: req.params.articleTitle},function(err){
      if(!err)res.send("Deleted Article Successfully");
      else res.send(err);
    })
  });



app.listen(3000, function() {
  console.log("Successfully connected to port 3000");
})
