const express = require ('express');
const MongoUtil = require('./MongoUtil.js');
const ObjectId = require('mongodb').ObjectId;
const hbs = require ('hbs');
const wax = require ('wax-on');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')

require('dotenv').config();

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}));

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    'cookie': { 
        maxAge:60000
    }
}))

app.use(flash())

app.use(function(req,res,next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

var helpers = require ("handlebars-helpers")({
    handlebars : hbs.handlebars
});

async function main() {
    const MONGO_URL=process.env.MONGO_URL;
    await MongoUtil.connect(MONGO_URL, "Vehicles");
    let db = MongoUtil.getDB();

    const carRoutes = require('./routes/carRoutes');
    app.use('/car', carRoutes);
}

main();


app.listen(3000, () => { 
    console.log("Express is running");
})