const User = require('../models/user');

module.exports.registerForm = (req, res) => {
	res.render('users/register');
};

module.exports.register = async (req, res) => {
	try {
		const { username, password, email } = req.body;
		const registeredUser = await User.register(new User({ username, email }), password);
		req.login(registeredUser, (error) => {
			if (error) {
				next(error);
			}
		});
		req.flash('success', 'Welcome to Yelp Camp!');
		res.redirect('/campgrounds');
	} catch (e) {
		req.flash('error', e.message);
		res.redirect('/register');
	}
};

module.exports.loginForm = (req, res) => {
	res.render('users/login');
};

module.exports.login = async (req, res) => {
	const redirectUrl = req.session.returnTo || '/campgrounds';
	delete req.session.returnTo;
	req.flash('success', 'Welcome back to Yelp Camp!');
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye!');
	res.redirect('/campgrounds');
};
