const express= require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose= require('mongoose');
const Vehicle = require('./app/models/vehicle');

//Configure app for bodyParser()
// let us grab data from the body of Post

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//setup port for server to listen on
const port= process.env.PORT || 3000;

//Connect to DB
mongoose.connect('mongodb://localhost:27017/codealong', {useNewUrlParser: true, useUnifiedTopology: true});

//API routes
const router= express.Router();

//routes will all be prefixed with /api
app.use('/api', router);

//MIDDLEWARE can be be useful for doing validation. We can log things from here
// stop the request from continuing in the event 
// that the request is not safe
// Middleware is used for all requests
router.use((req,res,next)=>{
    console.log('FYI... There is some processing currently going down...');
    next();
})

router.route('/vehicles').post((req,res)=>{
   const vehicle = new Vehicle();
   vehicle.make= req.body.make;
   vehicle.model = req.body.model;
   vehicle.color = req.body.color;

   // Save the data in mongoose database
   vehicle.save((err)=>{
       if(err){
        res.send(err);
       }
       res.json({message: 'Vehicle was successfully manufactured'});
   })
})
.get((req, res)=>{
    Vehicle.find((err, vehicles)=>{
        if(err){
            res.send(err);
        }
        res.json(vehicles);
    })
});

router.route('/vehicle/:vehicle_id').get((req,res)=>{
  Vehicle.findById(req.params.vehicle_id, (err, vehicle)=>{
     if(err){
         res.send(err);
     }
     res.json(vehicle);
  })
})

router.route('/vehicle/make/:make').get((req, res)=>{
    Vehicle.find({make: req.params.make}, (err, vehicle)=>{
       if(err){
           res.send(err);
       }
       res.json(vehicle);
    })
});

router.route('/vehicle/color/:color').get((req, res)=>{
    Vehicle.find({color: req.params.color}, (err, vehicle)=>{
        if(err){
            res.send(err)
        }
        res.json(vehicle);
    })
})



//Test route
router.get('/', (req, res)=>{res.json({message: 'Welcome to our API'})});

//fire up server
app.listen(port);
console.log(`Server listen on port ${port}`);
