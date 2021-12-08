const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	images: [
		{
			url: String,
			filename: String
		}
	],
	location: {
		type: String,
		required: true
	},
	reviews: [ { type: Schema.Types.ObjectId, ref: 'Review' } ],
	author: { type: Schema.Types.ObjectId, ref: 'User' }
});

campgroundSchema.post('findOneAndDelete', async function(campground) {
	if (campground.reviews.length) {
		await Review.deleteMany({ _id: { $in: campground.reviews } });
	}
});

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
