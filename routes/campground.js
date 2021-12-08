const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage: storage });

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router
	.route('/')
	.get(catchAsync(campgrounds.index))
	.post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.create));

router
	.route('/:id')
	.get(catchAsync(campgrounds.show))
	.put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.edit))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;
