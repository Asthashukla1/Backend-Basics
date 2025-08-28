const express =require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");

app.get("/", function(req,res){
    res.send('hey');
})

app.get("/create", async function(req,res){
    let user = await userModel.create({
        username: "Astha",
        age: 22,
        email: "asthashukla@gmail.com"
    });
    res.send(user);
})

app.get("/post/create", async function(req,res){
     let post = await postModel.create({
        postdata:"hello jiiiiiiiiiiiiiiii",
        user: "68b01d11202a6a8476086238"
    })

    let user = await userModel.findOne({_id:"68b01d11202a6a8476086238"})
    user.posts.push(post._id);
    await user.save();
    res.send({ post,user });
})

app.listen(3000);