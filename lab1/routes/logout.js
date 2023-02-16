import {Router} from 'express';
const router = Router();

const isLoggedIn = function (req) {
    if(req.session.user != undefined) {
        return true;
    } else {
        return false;
    }
};

router.get('/logout', async(req, res) => {
    if(isLoggedIn(req)) {
        const username = req.session.user
        req.session.destroy()
        req.session = null
        res.status(200).json({username : username, status: "You successfully logged out"})
    } else {
        res.status(403).json({error: "You must login first"})
    }
    
})

export default router;