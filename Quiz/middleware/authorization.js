function requireAuth(req, res, next) {
    const sess = req.session;
    if (sess.userDetails && sess.userDetails.username) {
        // User is authenticated, proceed to the next middleware or route handler
        next();
    } else {
        // User is not authenticated, redirect to login page
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const message = 'You are not logged in. Please <a href="/login.html">click here</a> to go to the login page.';
        res.status(401).send(message);
    }
}
function single(req,res,next){
    const sess=req.session;
    if(sess.userDetails && sess.userDetails.username)
    {
        next();
    }
}
module.exports = { requireAuth};