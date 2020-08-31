var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
	mongoose   = require('mongoose'),
	flash      = require("connect-flash");
    passport   = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override');
	// ----------- Models --------------
    Campground   = require('./model/campground'),
    Comment       = require('./model/comment'),
	//-------------------------------------
	User = require('./model/user');
   

//================================================================================================================

var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	indexRoutes = require("./routes/index")

//---------- Connecting to database --------------- 

mongoose.connect("mongodb://localhost/yelp_camp_diployable");

//-----------------------line to use bodyParser --------------------------
app.use(bodyParser.urlencoded({ extended: true }));

//------------------------Methode override ---------------

app.use(methodOverride("_method"));

//-----------------Telling express to use flash -----------------------------------------------
  app.use(flash());

// --------------------to get rid of ".ejs" extension --------------------

app.set('view engine', 'ejs');

//-------------------------------------------------------------------------
//------------------PUBLIC folder making public---------

 app.use(express.static(__dirname+"/public"));

//--------------------------------------------------------


//=====Passport Configuration =========

app.use(require("express-session")({
	secret:"Once again Rusty wins Cutest dog!",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser = req.user;   
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


//for shortning route paths 

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




app.listen(process.env.PORT, process.env.IP, function () {
    console.log('Server Started ! ');
});