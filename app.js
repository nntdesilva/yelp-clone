if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

mongoose
	.connect('mongodb://localhost:27017/yelpDB')
	.then((res) => {
		console.log('CONNECTED TO MONGO DB...');
	})
	.catch((err) => {
		console.log('Error...');
		console.log(err);
	});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
	mongoSanitize({
		replaceWith: '_'
	})
);

app.use(
	session({
		name: 'session',
		secret: 'thisissecret',
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			// secure: true,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
			maxAge: 1000 * 60 * 60 * 24 * 7
		}
	})
);

app.use(flash());
//passport docs - middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

app.use(
	helmet({
		contentSecurityPolicy: false
	})
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.message = req.flash('success');
	res.locals.error = req.flash('error');
	res.locals.user = req.user;
	next();
});

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
	res.render('home');
});

app.all('*', (req, res) => {
	throw new ExpressError('Page not found', 404);
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) {
		err.message = 'something went wrong!';
	}
	res.status(status).render('error', { err });
});

app.listen(3000, () => {
	console.log('LISTENING ON PORT 3000');
});

app.get('/campgrounds', (req, res) => {
	throw new ExpressError('Page not found', 404);
});
