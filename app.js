config = require("./config")

const express = require("express");
const fs = require("fs");

const app = express();
const jsonParser = express.json();

const filePath = "notes.json";
var notes = [];

app.use(express.static(__dirname + "/public"));

app.post("/notes", jsonParser, function(req, res){
    if(!req.body) return res.sendStatus(400);
    
    var title = null;
    var content = req.body.content;

    if (req.body.hasOwnProperty("title"))
        title = req.body.title;
    else
        title = createAutoTitle(content + "");
    
    var id = 0;
    if (notes.length > 0)
        id = notes[notes.length - 1].id + 1;
    
    let note = {id: id, title: title, content: content};
    notes.push(note);
    save();
    res.send(note);
});

app.get("/notes", function(req, res){
    res.send(notes);
});

app.get("/notes/:id", function(req, res){
    var result = notes.filter(obj => {
        return obj.id == req.param.id;
    });

    if (result.length == 0) return res.sendStatus(400);

    res.send(result);
});

app.put("/notes/:id", function(req, res){

});

app.delete("/notes/:id", function(req, res){

});

function createAutoTitle(data){
    return data.substr(0, config.N_FIRST_SYNBOLS_FOR_TITLE);
}

function read(){
    const content = fs.readFileSync(filePath, "utf8");
    notes = JSON.parse(content);
}

function save(){
    var data = JSON.stringify(notes);
    fs.writeFileSync(filePath, data);
}
   
app.listen(3000, function(){
    console.log("Connected");
    read();
    console.log("Notes: " + notes.length);
});