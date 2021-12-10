const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
	const camps = await Campground.find({});
	res.render('campgrounds/index', { camps });
};

module.exports.renderNewForm = (req, res) => {
	res.render('campgrounds/new');
};

module.exports.show = async (req, res) => {
	const camp = await Campground.findById(req.params.id)
		.populate([
			{
				path: 'reviews',
				model: Review,
				populate: {
					path: 'author',
					model: 'User'
				}
			}
		])
		.populate([ { path: 'author', model: User } ]);
	if (!camp) {
		req.flash('error', 'Campground not found :(');
		return res.redirect('/campgrounds');
	}

	res.render('campgrounds/show', { camp, mapBoxToken });
};

module.exports.renderEditForm = async (req, res) => {
	const camp = await Campground.findById(req.params.id);
	res.render('campgrounds/edit', { camp });
};

module.exports.edit = async (req, res) => {
	const { title, price, description, location } = req.body;
	const { id } = req.params;
	const camp = await Campground.findByIdAndUpdate(id, { title, price, description, location });
	const images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	camp.images.push(...images);
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
	}
	await camp.save();
	req.flash('success', 'Successfully Updated Campground!');
	res.redirect(`/campgrounds/${id}`);
};

module.exports.create = async (req, res, next) => {
	const { title, price, description, location } = req.body;
	const camp = new Campground({ title, price, description, location, author: req.user });
	camp.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	const geoData = await geocoder
		.forwardGeocode({
			query: location,
			limit: 1
		})
		.send();
	camp.geometry = geoData.body.features[0].geometry;
	await camp.save();
	req.flash('success', 'Successfully Made New Campground!');
	res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.delete = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	res.redirect('/campgrounds');
};
