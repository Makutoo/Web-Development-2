
import { ObjectId } from 'mongodb';
import { Router } from 'express';
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

const router = Router();

import { userData, recipeData } from '../data/index.js';
import validation from '../data/validation.js';



const isLoggedIn = function (req) {
    if (req.session.username != undefined && req.session._id != undefined) {
        return true;
    } else {
        return false;
    }
};


const authentication_Middleware = function (req, res, next) {
    if (isLoggedIn(req)) {
        next()
    } else {
        res.status(401).json({ error: "You must login first" })
    }
}

const urlCount = {}

const logAllReq_Middleware = function (req, res, next) {
    console.log("")
    console.log("request body:" + JSON.stringify(req.body, null, 4))
    const url = req.originalUrl
    console.log("url path:" + url)
    if (urlCount[url] == undefined) {
        urlCount[url] = 1
    } else {
        urlCount[url] = urlCount[url] + 1
    }
    console.log("HTTP verb:" + req.method)
    console.log("url request count:" + JSON.stringify(urlCount, null, 4))
    console.log("-----------------------")
    next()
}


router.use(logAllReq_Middleware)

router.post("/signup", async (req, res) => {
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


router.post("/login", async (req, res) => {
    try {
        const username = validation.checkUsernameIsVaild(req.body.username)
        const password = validation.checkPasswordIsVaild(req.body.password)
        const signinStatus = await userData.checkUsernameAndPassword(username, password)
        req.session.username = signinStatus.user.username;
        req.session._id = signinStatus.user._id;
        res.status(200).json(signinStatus.user)
        return
    } catch (e) {
        res.status(401).json({ error: e });
    }
    return
});

router.get('/logout', authentication_Middleware, async (req, res, next) => {
    const username = req.session.username
    req.session.destroy()
    req.session = null
    res.status(200).json({ username: username, status: "You successfully logged out" })
})

router.post('/recipes', authentication_Middleware, async (req, res) => {

    let createRecipeResult = undefined
    try {
        const title = validation.checkTitle(req.body.title);
        const ingredients = validation.checkIngredients(req.body.ingredients);
        const cookingSkillRequired = validation.checkCookingSkillRequired(req.body.cookingSkillRequired);
        const steps = validation.checkSteps(req.body.steps);
        const userThatPosted = { _id: ObjectId(req.session._id), username: req.session.username }
        createRecipeResult = await recipeData.createRecipe(title, ingredients, cookingSkillRequired, steps, userThatPosted)
    } catch (e) {
        res.status(400).json({ error: e });
        return
    }
    if (createRecipeResult != undefined) {
        res.status(200).json(createRecipeResult)
        client.del("pages")
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
    return
})

router.patch('/recipes/:id', authentication_Middleware, async (req, res) => {

    const recipeId = req.params.id
    let updateRecipeResult = undefined
    const updateFields = {}
    if (req.body.title != undefined) {
        updateFields.title = req.body.title
    }
    if (req.body.ingredients != undefined) {
        updateFields.ingredients = req.body.ingredients
    }
    if (req.body.cookingSkillRequired != undefined) {
        updateFields.cookingSkillRequired = req.body.cookingSkillRequired
    }
    if (req.body.steps != undefined) {
        updateFields.steps = req.body.steps
    }
    try {
        updateRecipeResult = await recipeData.updateRecipe(recipeId, req.session._id, updateFields)
    } catch (e) {
        if (e.cause != undefined) {
            res.status(403).json({ error: e.message })
        } else {
            res.status(400).json({ error: e });
        }

        return
    }
    if (updateRecipeResult != undefined) {
        res.status(200).json(updateRecipeResult)
        client.del("pages")
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
    return
})


router.post('/recipes/:id/comments', authentication_Middleware, async (req, res) => {

    const recipeId = req.params.id
    const comment = req.body.comment
    let addCommentResult = undefined
    try {
        if (typeof comment !== 'string') throw 'comment must be a string';
        const userThatPostedComment = {_id: req.session._id, username: req.session.username}
        addCommentResult = await recipeData.addCommentToRecipe(recipeId, userThatPostedComment, comment)
    } catch (e) {
        res.status(404).json({ error: "non-existent id" });
        return
    }
    if (addCommentResult != undefined) {
        res.status(200).json(addCommentResult)
        client.del("pages")
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
    return
})

router.delete('/recipes/:recipeId/:commentId', authentication_Middleware, async (req, res) => {

    const recipeId = req.params.recipeId
    const commentId = req.params.commentId
    let deleteCommentResult = undefined
    try {
        deleteCommentResult = await recipeData.deleteCommentFromRecipe(recipeId, commentId, req.session._id)
    } catch (e) {
        if (e.cause != undefined) {
            res.status(403).json({ error: e.message })
        } else {
            res.status(404).json({ error: "non-existent comment id or non-existent recipe id" });
        }
        return
    }
    if (deleteCommentResult != undefined) {
        res.status(200).json(deleteCommentResult)
        client.del("pages")
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
    return
})


router.post('/recipes/:id/likes', authentication_Middleware, async (req, res) => {

    const recipeId = req.params.id
    let likeResult = undefined
    try {
        likeResult = await recipeData.likeRecipe(recipeId, req.session._id)
    } catch (e) {
        res.status(404).json({ error: "non-existent ID"});
        return
    }
    if (likeResult != undefined) {
        res.status(200).json(likeResult)
        client.del("pages")
    } else {
        res.status(500).json({ error: "Internal Server Error" });
    }
    return
})


const findRecipesInCache = async (req, res, next) => {
    let page = req.query.page
    if (page == undefined) {
        page = 1
    }
    let result = await client.hGet("pages", page);
    //client.expire("pages", 15)
    if(result === null) {
        next();
    } else {
        res.status(200).json(JSON.parse(result))
    }
}

router.get('/recipes', findRecipesInCache, async (req, res) => {
    let page = req.query.page
    if (page == undefined) {
        page = 1
    }
    let recipes = undefined
    if (!(Number.isInteger(Number(page)) && Number(page) > 0)) {
        res.status(400).json({ error: "page numst be positve number" })
        return
    }
    try {
        recipes = await recipeData.getRecipesByPage(page)
    } catch (e) {
        res.status(400).json({ error: e })
        return
    }
    if (recipes != undefined) {
        await client.hSet('pages', page, JSON.stringify(recipes))
        res.status(200).json(recipes)
    } else {
        res.status(500).json({ error: "Internal Server Error" })
    }
})




const findRecipeInCache = async (req, res, next) => {
    const recipeId = req.params.id
    let exists = await client.exists(recipeId);
    if (exists) {
        console.log('Recipe in cache');
        //if we do, then send that to the client
        let searchResults = await client.get(recipeId);
        console.log('Sending Recipe from Redis....');
        const recipe = JSON.parse(searchResults)
        res.status(200).json(recipe)
    } else {
        console.log('Recipe not in cache');
        next()
    }
}

router.get('/recipes/:id', findRecipeInCache, async (req, res) => {
    const recipeId = req.params.id
    let recipe = undefined
    try {
        recipe = await recipeData.getRecipeByIdAndStoreInRedis(recipeId)
    } catch (e) {
        res.status(404).json({ error: "non-existent ID" })
        return
    }
    if (recipe != undefined) {
        res.status(200).json(recipe)
    } else {
        res.status(500).json({ error: "Internal Server Error" })
    }
})

router.get('/mostaccessed', async (req, res) => {
    const mostaccessed = await client.zRange('mostaccessed', 0, 9, { REV: true });
    const result = [];

    for (let idx = 0; idx < mostaccessed.length; idx += 1) {
        const cur = mostaccessed[idx];
        result.push(JSON.parse(await client.get(cur)));
    }
    res.status(200).json(result)
})

const constructorMethod = (app) => {
    app.use("/", router)
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Route Not found' });
    });
}

export default constructorMethod;
