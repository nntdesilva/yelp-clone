const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose
	.connect('mongodb://localhost:27017/yelpDB')
	.then((res) => {
		console.log('CONNECTED TO MONGO DB...');
	})
	.catch((err) => {
		console.log('Error...');
		console.log(err);
	});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async function() {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const r = Math.floor(Math.random() * 1000) + 1;
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			title: `${sample(descriptors)} ${sample(places)}`,
			price,
			description:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			images: [
				{
					url:
						'https://res.cloudinary.com/dfyftbk1x/image/upload/v1638955671/YelpCamp/noi67qlbuhfsyfkmpjr5.jpg',
					filename: 'YelpCamp/noi67qlbuhfsyfkmpjr5'
				},
				{
					url:
						'https://res.cloudinary.com/dfyftbk1x/image/upload/v1638955672/YelpCamp/gfmaqdlsubjdlfggtyth.jpg',
					filename: 'YelpCamp/gfmaqdlsubjdlfggtyth'
				}
			],
			location: `${cities[r].city}, ${cities[r].state}`,
			author: '61ab8af63b091aad87c47337'
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
