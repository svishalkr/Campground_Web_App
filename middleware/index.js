var Campground = require("../model/campground");
var Comments = require("../model/comment");

 

var middlewareObj = {};

//----------middleware to protect edit,update,and delete route from unauthorized access-------------------

middlewareObj.checkCampgroundOwnership =  function (req, res, next) {
    if (req.isAuthenticated()) {     //is any user loged in ?
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err || !foundCampground ) {
				req.flash("error", "Campground not found");
                res.redirect('back');
            } else {
                //does user own the campgrounds?
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
					req.flash("error", "You don't have permission to do that ");
                    res.redirect("back");
                }
            }
        });
    } else {
		req.flash("error", "You need to be logged in to do that ");
		res.redirect("back");
    }
}


//----------one more middleware to protect edit,update,and delete comments route from unauthorized access----------------

middlewareObj.checkCommentOwnership = function(req, res, next) 
{
    if (req.isAuthenticated()) { //is any user loged in ?
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err || !foundComment) {
				req.flash("error", "Comment not found !")
                res.redirect('back');
            } else {
                //does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
					req.flash("error", "You don't have permission to do that !");
                    res.redirect("back");
                }
            }
        });
       }
	else 
	{req.flash("error", "You need to be logged in to do that !");
		res.redirect("back");
    }
}

//--------------------------------------------------------------------------------------------------

middlewareObj.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated())
		{
			return next();
		}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
}



module.exports = middlewareObj