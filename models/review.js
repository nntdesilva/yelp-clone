const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	body: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	campground: { type: Schema.Types.ObjectId, ref: 'Review' },
	author: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
