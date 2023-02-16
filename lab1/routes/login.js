import {Router} from 'express';
const router = Router();

import { userData } from '../data/index.js';
import validation from '../data/validation.js';

router.post("/login", async (req, res) => {
    try {
        const username = validation.checkUsernameIsVaild(req.body.username)
        const password = validation.checkPasswordIsVaild(req.body.password)
        const signinStatus = await userData.checkUsernameAndPassword(username, password)
        req.session.user = signinStatus.user.username;
        req.session._id = signinStatus.user._id;
        res.status(200).json(signinStatus.user)
        return
    } catch (e) {
        res.status(400).json({error: e});
    }
    return
});

export default router;