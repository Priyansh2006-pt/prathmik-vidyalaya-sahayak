// Blocks access to a page unless the user is logged in.
// Attach this to any route that should be protected.

module.exports = function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'कृपया पहले लॉगिन करें।');
    return res.redirect('/auth/login');
};
