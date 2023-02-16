import {Router} from 'express';
const router = Router();

import { userData } from '../data/index.js';
import validation from '../data/validation.js';


router.post("/signup", async (req, res) => {
    console.log(req.body)
    let signupResult = undefined
    try {
        const name = validation.checkNameIsVaild(req.body.name)
        const username = validation.checkUsernameIsVaild(req.body.username)
        const password = validation.checkPasswordIsVaild(req.body.password)
        signupResult = await userData.createUser(name, username, password)
    } catch (e) {
        res.status(400).json({ error: e });
        return
    }
    if (signupResult != undefined) {
        res.status(200).json(signupResult)
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
    return
});

export default router;