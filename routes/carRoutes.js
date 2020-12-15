const express = require ('express');
const router = express.Router();
const MongoUtil = require('../MongoUtil');
const ObjectId = require('mongodb').ObjectId;

let db = MongoUtil.getDB();

router.get('/', async (req,res) => {
      let car = await db.collection('Car').find().toArray();
      res.render('carRecord', {
          'carRecord': car
      })
    })

router.get('/add', async (req,res) => {
        res.render('add_car');
    })

router.post('/add', async(req,res) => {
        let {Brand,Model,Power,Type,Seaters,Year,Cost,Accessories} = req.body;

        if(!Array.isArray(Accessories)){
            if(!Accessories){
                Accessories=[]
            } else {
                Accessories =['Accessories']
            }
        }


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
        req.flash('success_messages', "New Car record has been added !")
      await db.collection('Car').insertOne(newCardRecord);
      res.redirect('/car')
    })

router.get('/:id/update', async(req,res) => {
        let carRecord = await db.collection('Car').findOne({ 
            '_id' : ObjectId(req.params.id)
        })
        res.render('edit_car', {
            'carRecord' : carRecord
        })    
    })

router.post('/car/:id/update', async (req,res) => {
        let updateCar = {...req.body};

        if (!updatedCar.Accessories){
            updateCar.Accessories = []
        } 

        if (Array.isArray(updateCar.Accessories)){
            updateCar.Accessories = updateCar.Accessories;
        } else {
            updateCar.Accessories = [updateCar.Accessories];
        }
         
        await db.collection('Car').updateOne({
            '_id': ObjectId(req.params.id)
        },{
                '$set' : updateCar
            });
        res.redirect('/car')
    })

router.get('/:id/delete', async (req,res) => {
        let carRecord = await db.collection('Car').findOne({
            '_id' : ObjectId(req.params.id)
        })
        res.render('confirm_delete_car',{
            'carRecord' : carRecord
        })
    })

router.post('/:id/delete', async (req,res) => {
        await db.collection('Car').deleteOne({
            '_id' : ObjectId(req.params.id)
        })
        req.flash('error_messages','Fault with id:${req.params.id} has been deleted');
        res.redirect('/car')
    })

    module.exports = router;
