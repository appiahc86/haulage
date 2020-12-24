
const admin = function (req, res, next) {

    if (parseInt(req.user.role) === 1 || parseInt(req.user.role) === 2){
        return  next();
    }

    return res.redirect('/');
}


export default admin;