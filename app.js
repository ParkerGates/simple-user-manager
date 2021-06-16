const express = require("express");
const fs = require("fs")
const path = require("path");

const app = express();

app.use(express.urlencoded());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
fs.writeFile('./public/users.json', "[]", function(){});
console.clear();

let curIndex = [];
let curId = -1;
const idList = [];


//INDEX==========================================================================================
app.get("/", (req, res) => {
    res.render('index');
})
app.post("/", (req, res) => {

    fs.readFile("./public/users.json", "utf8", (err, jsonString) => { 
        let obj = JSON.parse(jsonString);
        let uuid = func();
        idList.push(uuid);

        let user = {
            id: uuid,
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        }

        obj.push(user);
        obj = JSON.stringify(obj)
        fs.writeFile('./public/users.json',obj, function(){});
        res.redirect('/listing');
    });
});




//LISTING========================================================================================
app.get('/listing', (req, res) => {
    fs.readFile("./public/users.json", "utf8", (err, jsonString) => { 
        let obj = JSON.parse(jsonString);

        res.render('listing', {
            userList: obj,
            userListLength: lengthToString(obj.length)
        });
    });
});




//EDIT===========================================================================================
app.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    curId = id;
    fs.readFile("./public/users.json", "utf8", (err, jsonString) => { 
        let obj = JSON.parse(jsonString);
        let index = findUserPosition(id, obj);
        curIndex.push(index);

        res.render('edit', {
                user: obj[index]
        });
    });
});
app.post('/edit', (req, res) => {
    fs.readFile("./public/users.json", "utf8", (err, jsonString) => {
        let obj = JSON.parse(jsonString);
        let index = curIndex[0];
        obj.splice(index, 1);

        const editedUser = {
            id: curId,
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        }

        obj.splice(index, 0, editedUser);
        curIndex = [];

        fs.writeFile('./public/users.json', JSON.stringify(obj), function(){});
        res.redirect('/listing');
    });
});




//DELETE=========================================================================================
app.get('/delete/:id', (req, res) => {
    fs.readFile("./public/users.json", "utf8", (err, jsonString) => {
        let obj = JSON.parse(jsonString);
        const id = req.params.id;
        let index = findUserPosition(id, obj);
        obj.splice(index, 1);

        fs.writeFile('./public/users.json', JSON.stringify(obj), function(){});
        res.redirect('/listing');
    });
});




//LISTENING======================================================================================
app.listen(2000, () => { console.log("Listening To Port: 2000"); })




//FUNCTIONS======================================================================================
function func() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g , function(c) {
    var rnd = Math.random()*16 |0, v = c === 'x' ? rnd : (rnd&0x3|0x8) ;
    return v.toString(16);
    });
}


function lengthToString(length) {
    let arr = [];
    for (let i = 0; i < length; i++) {
        arr.push(i);
    }
    return arr
}


function findUserPosition(id, obj){
    for (let i = 0; i < obj.length; i++) {
        if (id === obj[i].id) {
            return i;
        }
    }
}