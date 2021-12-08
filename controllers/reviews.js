const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
	const { id } = req.params;
	const { rating, body } = req.body;
	const camp = await Campground.findById(id);
	const review = new Review({ rating, body, author: req.user });
	camp.reviews.push(review);
	review.campground = camp;
	await camp.save();
	await review.save();
	req.flash('success', 'Successfully added review!');
	res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Review.findByIdAndDelete(reviewId);
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
	req.flash('success', 'Successfully deleted review!');
	res.redirect(`/campgrounds/${id}`);
};
