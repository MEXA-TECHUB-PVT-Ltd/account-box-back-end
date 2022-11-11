const express = require('express');
const router = express.Router();

//Required api's 
const ImageUpload = require('./Routes/ImageUpload')
const Admin = require('./Routes/Admin')
const SubscriptionPlan = require('./Routes/SubscriptionPlan')
const Tycoon = require('./Routes/Tycoon')
const Managers = require('./Routes/Managers')
const Shop = require('./Routes/Shops')
const Products = require('./Routes/Product')



/*********Main Api**********/

router.use('/Upload', ImageUpload);
router.use('/admin',Admin);
router.use('/subscriptionPlan',SubscriptionPlan);
router.use('/tycoon',Tycoon);
router.use('/managers',Managers);
router.use('/shop',Shop);
router.use('/product',Products);





module.exports = router;