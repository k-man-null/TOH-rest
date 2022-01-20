const express = require('express');//bring in express
const cors = require('cors');//cors errors need to be sorted
const morgan = require('morgan');//For logging(the middleware)
const app = express();//initialize an express instance
app.use(morgan('combined'));//use the logging middleware
const mongoose = require('mongoose');// for models you heard of Model(Mongoose) View(Angular) Controller(Express)??===Debatable
//This is the api 
const url = 'mongodb://172.17.0.2:27017';//container address



const Hero = require('./models/hero');
app.use(cors());//use the cord middleware for our app
app.use(express.json());//this is for json..

app.get('/api/heroes', async (req, res) => {//first route get all heroes in the db//it is also for the search functionality since both share the same route..
    
//FYI...this was the part where I almost gave up searching stack overflow...
//Until the mongo docs came to the rescue
    let term = req.query.name;

    if (!term) {//if the request has no query, get everything fro the db
        await mongoose.connect(url);
        await Hero.find({}).then(result => {
            res.json(result)
        });
    } else {
        await mongoose.connect(url);
//Get the resource with any if the characters in the name
//This is how you search mongodb database...
        await Hero.find({ name: { $regex: `${term}`, $options: 'i'}}).then(result => {
            res.json(result);
        });
    }
})

//get a resource by its id
app.get('/api/heroes/:id', async (req, res) => {
    const id = req.params.id;
    console.log(typeof(id));
    await mongoose.connect(url);

    await Hero.findById(id).then(result => {
        //respond wiith json
        res.json(result);
        mongoose.connection.close();
    })

})

//modify a hero 
app.put('/api/heroes/', async (req, res) => {
    
    const {_id, name} = req.body
    await mongoose.connect(url);

    await Hero.updateOne({ _id: _id }, { name: name }).then(
        res.json(`Changed heroname to ${name}`)
    );
    //Find the hero
    mongoose.connection.close()
    //Update the hero with body param
})

//when creating a new hero, the server is expected to generate the id
app.post('/api/heroes', async (req, res) => {
    const data = req.body;

    await mongoose.connect(url);

    const hero = new Hero({
        name: data.name
    });


    await hero.save().then(result => {
        res.json(result);
        mongoose.connection.close();
    })

})

app.delete('/api/heroes/:id', async (req, res) => {

    const id = req.params.id;

    await mongoose.connect(url);
    //Find the hero of id
    await Hero.deleteOne({ _id: id }).then(
        res.json("deleted successfully")
    )
    //Delete the hero
    mongoose.connection.close();
    //respond appropriately
})


const port = 3000
app.listen(port, () => {
    console.log(`Server istening on port ${port}`)
})