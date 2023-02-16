import { ObjectId } from 'mongodb';
import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import users from '../data/users.js';
import recipes from '../data/recipes.js';


const db = await dbConnection();
await db.dropDatabase();



const userOne = await users.createUser('Ziheng Zhu', 'makutoo', 'Zzh123456!')
const userTwo = await users.createUser('Linyu Liu', 'Alice', 'Zzh123456!')
const userThree = await users.createUser('AKA Mu', 'Blice', 'Zzh123456!')

const loginStatus = await users.checkUsernameAndPassword('makutoo', 'Zzh123456!')
console.log(loginStatus)

const myRecipe = {
    title: "Fried Chicken", 
    ingredients: ["One whole chicken", "2 cups of flour", "2 eggs", "salt", "pepper", "1 cup cooking oil"], 
    cookingSkillRequired: "Novice",
    steps: ["Next, dip the chicken into the mix","First take the two eggs and mix them with the flour, the salt and the pepper", "Next, dip the chicken into the mix", "take 1 cup of oil and put in frier", "Fry the chicken on medium heat for 1 hour"],
    userThatPosted: {_id: userOne._id, username: userOne.username}, 
}
// const recipeOne = await recipes.createRecipe(myRecipe.title, myRecipe.ingredients, myRecipe.cookingSkillRequired,myRecipe.steps, myRecipe.userThatPosted)
// console.log(recipeOne)


// const updateFields = {
//     title: "Fried Pig",
//     cookingSkillRequired: "Intermediate",
// }

// const newRecipe = await recipes.updateRecipe(ObjectId("63d341080ce301669d22eeba"), ObjectId("63d341080ce301669d22eeb8"), updateFields)
// console.log(newRecipe)

// const userThatPostedComment= {_id: userTwo._id, username: userTwo.username}
// const mycomment = "this is fucking good"

// const recipeWithComment = await recipes.addCommentToRecipe(recipeOne._id, userThatPostedComment, mycomment)

// const commentId = recipeWithComment.comments[0]._id
// console.log(recipeWithComment)

// const recipeDeleteComment = await recipes.deleteCommentFromRecipe(recipeOne._id, commentId ,userOne._id)
// console.log(recipeDeleteComment)

// const like = await recipes.likeRecipe(recipeOne._id, userTwo._id)
// console.log(like)

// const like2 = await recipes.likeRecipe(recipeOne._id, userThree._id)
// console.log(like2)

// const unlike = await recipes.likeRecipe(recipeOne._id, userTwo._id)
// console.log(unlike)

function convertintChar(integer) {
    let character = 'a'.charCodeAt(0);
    
    return String.fromCharCode(character + integer);
   }

for (let i = 0; i < 10; i++) {
    let character = convertintChar(i)
    await recipes.createRecipe(myRecipe.title+character, myRecipe.ingredients, myRecipe.cookingSkillRequired,myRecipe.steps, myRecipe.userThatPosted)
}

// const rs = await recipes.getRecipesByPage(5)
// console.log(rs)

console.log('Done seeding database');
await closeConnection();