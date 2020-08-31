var express = require("express");
var router = express.Router();

var passport = require("passport");
var User = require("../model/user");
//------------------------------------------------------

//root route
router.get('/', function (req, res) {
    res.render('landing');
});

//=================Auth Routes ============

//--------------Sign Up Routes ----------------

//show SignUp form

router.get("/register",function(req,res){
	res.render("register",{page: 'register'});
});

//show SignUp Logic

router.post("/register",function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password,function(err,user){
		if(err)
			{
				 
             return res.render("register", {"error": err.message});
    
			}
		passport.authenticate("local")(req,res, function(){
			req.flash("success", "Welcome to YelpCamp" +user.username);
			res.redirect("/campgrounds");
		});
	});  
});

//----------------- Log In routes ------------------------------

//show log in form 

router.get("/login", function(req,res){
	res.render("login", {page: 'login'});
});



router.post("/login", passport.authenticate("local",
	{
	successRedirect:"/campgrounds",
	failureRedirect:"/login"
	}), function(req,res){
	
	
});

//------------------------- Log Out Route ----------------

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged you out !" );
	res.redirect("/campgrounds");
});

//--------------------------------------------------------




module.exports=router;