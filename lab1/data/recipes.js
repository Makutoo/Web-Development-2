import { recipes } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from './validation.js';



const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
}

const exportedMethods = {
    async getRecipeById(recipeId) {
        const recipeCollection = await recipes();
        let recipe = await recipeCollection.findOne({ _id: ObjectId(recipeId) });
        if (recipe === null) throw 'No recipe with that id';
        return recipe;
    },

    async createRecipe(title, ingredients, cookingSkillRequired, steps, userThatPosted) {
        try {
            title = validation.checkTitle(title);
            ingredients = validation.checkIngredients(ingredients);
            cookingSkillRequired = validation.checkCookingSkillRequired(cookingSkillRequired);
            steps = validation.checkSteps(steps);
        } catch (e) {
            throw e
        }
        const recipeCollection = await recipes();
        let newRecipe = {
            title: title,
            ingredients: ingredients,
            steps: steps,
            cookingSkillRequired: cookingSkillRequired,
            userThatPosted: userThatPosted,
            comments: [],
            likes: []
        }

        const insertInfo = await recipeCollection.insertOne(newRecipe);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw 'Could not add recipe';
        }
        return await this.getRecipeById(insertInfo.insertedId.toString())
    },

    async updateRecipe(recipeId, actionUserID, updateFields) {
        const oldRecipe = await this.getRecipeById(recipeId)
        if (oldRecipe.userThatPosted._id.toString() != actionUserID.toString()) {
            throw new Error('you cannot update the recipe from other people', { cause: "403" });
        }
        let newRecipe = {}
        let numOfFieldtoUpdate = 0;
        if (updateFields.title != undefined && updateFields.title !== oldRecipe.title) {
            newRecipe.title = validation.checkTitle(updateFields.title)
            numOfFieldtoUpdate++
        } else {
            updateFields.title = oldRecipe.title
        }

        if (updateFields.ingredients != undefined && !equalsCheck(updateFields.ingredients, oldRecipe.ingredients)) {
            newRecipe.ingredients = validation.checkIngredients(updateFields.ingredients)
            numOfFieldtoUpdate++
        } else {
            updateFields.ingredients = oldRecipe.ingredients
        }

        if (updateFields.steps != undefined && !equalsCheck(updateFields.steps, oldRecipe.steps)) {
            newRecipe.steps = validation.checkSteps(updateFields.steps)
            numOfFieldtoUpdate++
        } else {
            updateFields.steps = oldRecipe.steps
        }

        if (updateFields.cookingSkillRequired != undefined && updateFields.cookingSkillRequired !== oldRecipe.cookingSkillRequired) {
            newRecipe.cookingSkillRequired = validation.checkCookingSkillRequired(updateFields.cookingSkillRequired)
            numOfFieldtoUpdate++
        } else {
            updateFields.cookingSkillRequired = oldRecipe.cookingSkillRequired
        }

        if (numOfFieldtoUpdate == 0) {
            throw 'there is nothing need to update'
        }
        newRecipe.userThatPosted = oldRecipe.userThatPosted
        newRecipe.comments = oldRecipe.comments
        newRecipe.likes = oldRecipe.likes

        const recipeCollection = await recipes();
        const updateInfo = await recipeCollection.updateOne(
            { _id: ObjectId(recipeId) },
            { $set: newRecipe }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';
        return await this.getRecipeById(recipeId);
    },

    async addCommentToRecipe(recipeId, userThatPostedComment, comment) {
        if (typeof comment !== 'string') throw 'comment must be a string';
        if (comment.length == 0) throw 'comment cannot be empty'
        const recipe = await this.getRecipeById(recipeId)
        const commentBody = {_id: ObjectId(), userThatPostedComment: userThatPostedComment, comment: comment}
        recipe.comments.push(commentBody)
        const recipeCollection = await recipes();
        const updateInfo = await recipeCollection.updateOne(
            { _id: ObjectId(recipeId) },
            { $set: recipe }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';
        return await this.getRecipeById(recipeId);
    },

    async deleteCommentFromRecipe(recipeId, commentIdToDelete, actionUserId) {
        const recipe = await this.getRecipeById(recipeId)
        if(commentIdToDelete == undefined) throw 'Must provide the commentId'
        let newComments = []
        
        recipe.comments.forEach(comment => {
            if(comment._id != commentIdToDelete) {
                newComments.push(comment)
            } else {
                if(actionUserId != comment.userThatPostedComment) {
                    throw new Error('you cannot delete the comment that was not written by you', { cause: "403" });
                }
            }
        });
        if(newComments.length == recipe.comments.length) {
            throw 'The delete comment id not found'
        } 
        recipe.comments = newComments
        const recipeCollection = await recipes();
        const updateInfo = await recipeCollection.updateOne(
            { _id: ObjectId(recipeId) },
            { $set: recipe }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';
        return await this.getRecipeById(recipeId);
        
    },

    async likeRecipe(recipeId, actionUserId) {
        actionUserId = actionUserId.toString()
        const recipe = await this.getRecipeById(recipeId)
        
        if(!recipe.likes.includes(actionUserId)){          //checking weather array contain the id
            recipe.likes.push(actionUserId);               //adding to array because value doesnt exists
        }else{
            recipe.likes.splice(recipe.likes.indexOf(actionUserId), 1);  //deleting
        }
        
        const recipeCollection = await recipes();
        const updateInfo = await recipeCollection.updateOne(
            { _id: ObjectId(recipeId) },
            { $set: recipe }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
            throw 'Update failed';
        return await this.getRecipeById(recipeId);
    },

    async getRecipesByPage(pageNumber=1, nPerPage=50) {
        const recipeCollection = await recipes();
        let allRecipes = []
        await recipeCollection
            .find()
            .skip( pageNumber > 0 ? ( ( pageNumber - 1 ) * nPerPage ) : 0 )
            .limit( nPerPage )
            .forEach( recipe => {
                allRecipes.push(recipe)
            });
        if(allRecipes.length == 0) {
            throw 'there are no more recipes'
        }
        return allRecipes;
    }
}

export default exportedMethods;