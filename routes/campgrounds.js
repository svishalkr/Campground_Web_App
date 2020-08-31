var express = require("express");
var router = express.Router();
var Campground = require("../model/campground");
var middleware = require("../middleware");

//REST : 1-Index -- Show all campgrounds


router.get('/', function (req, res) {
	
	// get all campgrounds from db 
	
	Campground.find({},function(err, allcampground){
		
		if(err)
			{
				console.log("Error");
				console.log(err);
			}
		else 
			{
				res.render('campgrounds/Index', { campgrounds: allcampground, page: 'campgrounds'});
			}
	});
	
});

//-----------------------------------------------------------------------------------------------------------------
//REST: 2 - CREATE
//Add new campground to DB


router.post('/', middleware.isLoggedIn, function (req, res) {
    
    var name = req.body.name;
	var price = req.body.price;
    var image = req.body.image;
	var desc = req.body.description;
    var author = {
		id:req.user._id,
		username:req.user.username
	}
    var newCampGround = { name: name,price:price, image: image, description:desc,author:author };
	
 
	Campground.create(newCampGround,function(err, newlyCreated){
	if(err)
		{
			console.log("Error !");
			console.log(err);
		}
	else
	   {
		 
		 res.redirect('/campgrounds'); 
		   
 	   }
});
   
  
     
});
//------------------------------------------------------------------------------------
//REST: 3 - New
//Show form to create new  campground
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

//---------------------------------------------------------------------------
//REST: 4 Show

router.get("/:id", function(req,res){
	//find the campground with provided id
	
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground)
			{
				req.flash("error","campground not found !");
				res.redirect("back");
			}
		else
		{    
			//render that campground
			res.render("campgrounds/show",{campground:foundCampground});
		}
		
	});
	
});
//--------------------------------------------------------------------------------------------------------------------
// --------------Edit and Update ------------------------

//Edit campground Route

router.get('/:id/edit', middleware.checkCampgroundOwnership, function (req, res)
	{
        Campground.findById(req.params.id, function (err, foundCampground) 
	{
        res.render('campgrounds/edit', { campground: foundCampground });

    });
});



//Update campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,updatedCampground){
		if(err)
			{
				res.redirect("/campgrounds");
			}
			else
				{
				res.redirect("/campgrounds/"+req.params.id);	
				}
	});
});
//---------------------------------------------------------------------------------------------------------------
// --------------- Delete Campground Route --------------------------------------------------------------------

router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err)
			{
				res.redirect("/campgrounds");
			}
		else
		    {
			res.redirect("/campgrounds");
		    }
	});
});


//----------------------------------------------------------------------------------


module.exports = router;