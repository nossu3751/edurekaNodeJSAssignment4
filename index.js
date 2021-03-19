const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const port = 8000;
const app = express();
const mongourl = 'mongodb://127.0.0.1:27017/';

const dbName = "assignments";
const client = new MongoClient(mongourl);

var movieList = [
    {
        name:"Titanic",
        genre:"Romance",
        rating:9,
        language:"English"
    },
    {
        name:"Parasite",
        genre:"Thriller",
        rating:8.5,
        language:"Korean"
    },
    {
        name:"Proposal",
        genre:"Romance",
        rating:7,
        language:"English"
    },
    {
        name:"Orient Express",
        genre:"Mystery",
        rating:8,
        language:"English"
    },
    {
        name:"Pad Man",
        genre:"Drama",
        rating:9,
        language:"Hindi"
    }

]

insertMovie = (collection, movie) => {
    return new Promise((resolve)=>{
        collection.update(
            movie,
            {
                "$set": movie
            },
            {
                "upsert":true
            }
        ).then((result)=>{
            resolve(true);
        })
    })
}

client.connect((err, client) => {
    if(err) throw err;
    console.log("Connected Successfully to server.");

    const db = client.db(dbName);
    const movieCollection = db.collection('Movies');

    //Question 1 query
    insertMovie(movieCollection, {
        name:"Wreck it Ralph", 
        genre:"Kids", 
        rating:7, 
        language:"English"}
    ).then((success)=>{
        //Question 2 query
        movieCollection.find({}).toArray((error,result)=>{
            if(error) throw error;
            console.log("Question 2:",result);
        });
    
        //Question 3 query
        movieCollection.findOne({"name": "Titanic"}).then((response)=>{
            if(response){
                console.log("Question 3:", response);
            }else{
                console.log("Coudn't find that!");
            }
        })
        
        //Question 4 query 
        movieCollection.find({}).sort({rating:-1}).limit(3).toArray((error, result)=>{
            if(error) throw error;
            console.log("Question 4:", result);
        })
    
        //Question 5 query

        movieCollection.update(
            {"name":"Titanic"},
            {
                $set: {
                    "achievements":["Super hit", "Super Duper hit"]
                }
            }
        ).then((result)=>{
            movieCollection.findOne({"name":"Parasite"}).then((movie)=>{
                let currMovie = movie;
                currMovie.achievements = ["Super hit"];
                movieCollection.save(currMovie);
            })
        })

        //Question 6 query

        movieCollection.find({"achievements":["Super hit", "Super Duper hit"]}).toArray().then(items => {
            console.log("Question 6:",items);
        })


        //Question 7 query

        movieCollection.find({"achievements":{$exists: true}}).toArray().then(
            items => {
                console.log("Question 7:", items);
            }
        )
    })
    
    


    app.listen(port, ()=>{
        console.log(`Server running on port ${port}.`)
    })
})


