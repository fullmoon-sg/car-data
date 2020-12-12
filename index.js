const express = require ('express');
const MongoUtil = require('./MongoUtil.js');
const ObjectId = require('mongodb').ObjectId;
const hbs = require ('hbs');
const wax = require ('wax-on');

require('dotenv').config();

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

var helpers = require ("handlebars-helpers")({
    handlebars : hbs.handlebars
});

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "Vehicles");
    let db = MongoUtil.getDB();

    app.get('/', async (req,res) => {
      let car = await db.collection('Car').find().toArray();
      res.render('carRecord', {
          'carRecord': car
      })
    })

    app.get('/car/add', async (req,res) => {
        res.render('add_car');
    })

    app.post('/car/add', async(req,res) => {
        let {Brand,Model,Power,Type,Seaters,Year,Cost,Accessories} = req.body;
        let newCardRecord = {
            'Brand' : Brand,
            'Model' : Model,
            'Power' : Power,
            'Type'  : Type,
            'Seaters': Seaters,
            'Year' : Year,
            'Cost' : Cost,
            'Accessories' : Accessories
        };
      await db.collection('Car').insertOne(newCardRecord);
      res.redirect('/')
    })

    app.get('/car/:id/update', async(req,res) => {
        let carRecord = await db.collection('Car').findOne({ 
            '_id' : ObjectId(req.params.id)
        })
        res.render('edit_car', {
            'carRecord' : carRecord
        })    
    })

    app.post('/car/:id/upate', async (req,res) => {
        let {Brand,Model,Power,Type,Seaters,Year,Cost,Accessories} = req.body;
          let newCarRecord = {
            'Brand' : Brand,
            'Model' : Model,
            'Power' : Power,
            'Type'  : Type,
            'Seaters': Seaters,
            'Year' : parseInt(Year),
            'Cost' : parseInt(Cost),
            'Accessories' : Accessories
        }
           
        db.collection('Car').updateOne({
            '_id': ObjectId(req.params.id)
        },{
                '$set' : newCarRecord
            });
        res.redirect('/')
    })

    app.get('/car/:id/delete', async (req,res) => {
        let carRecord = await db.collection('Car').findOne({
            '_id' : ObjectId(req.params.id)
        })
        res.render('confirm_delete_car',{
            'carRecord' : carRecord
        })
    })

    app.post('/car/:id/delete', async (req,res) => {
        await db.collection('Car').deleteOne({
            '_id' : ObjectId(req.params.id)
        })
        res.redirect('/')
    })
}

main();


app.listen(3000, () => { 
    console.log("Express is running");
})