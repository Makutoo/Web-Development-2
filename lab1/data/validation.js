import { ObjectId } from 'mongodb';

const alphanumeric = /^[\p{sc=Latn}\p{Nd}]*$/u;
const passWordPattern = /^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?\W).*$/
const alphabetsAndSpace = /^[a-zA-Z ]*$/;
const onlyNumeric = /^[0-9]*$/;

const exportedMethods = {
  checkNameIsVaild(name) {
    if (!name) throw 'must provide name';
    if (typeof name !== 'string') throw 'name must be a string';
    if(!name.match(alphabetsAndSpace)) throw 'name must be alphabets or alphabetsAndSpace'
    return name.toLowerCase()
  },
  checkUsernameIsVaild(username) {
    if (!username) throw 'must provide username';
    if (typeof username !== 'string') throw 'username must be a string';
    if (username.length < 3) {
      throw 'username should be at least 3 characters long';
    }
    if(!username.match(alphanumeric)) {
      throw 'username should be alphanumeric'
    } 
    if(username.match(onlyNumeric)) {
      throw 'username cannot be just number'
    }
    return username.toLowerCase();
  },

  checkPasswordIsVaild(password) {
    if(!password) throw 'must provide password'
    if (typeof password !== 'string') throw 'password must be a string';
    if(password.indexOf(' ') >= 0) {
      throw 'password should not contains space';
    }
    if(password.match(passWordPattern)) {
      return password;
    } else {
      throw 'password should be 6 characters minimum, with at least one lowercase letter, one uppercase letter, one number and one special character contained in it.'
    } 
  },

  checkTitle(title) {
    if(!title) throw 'must provide title'
    if (typeof title !== 'string') throw 'title must be a string';
    title = title.trim();
    if(title.length < 3) throw 'title is to short, should be at least 3 characters long '
    if(title.match(/^[a-zA-Z\s]*$/)) {
      return title
    } else {
      throw 'title should be alphabetic characters to make sense'
    }
  },
  
  checkIngredients(ingredients) {
    if(!Array.isArray(ingredients)) throw 'ingredients must be an array'
    if(ingredients.length < 3) throw 'should be at least 3 valid elements in the ingredients array'
    ingredients.forEach(ingredient => {
      if(!ingredient) throw 'one of the ingredient is undefine'
      if (typeof ingredient !== 'string') throw 'ingredient must be a string';
      ingredient = ingredient.trim();
      if(ingredient.length < 3 || ingredient.length > 50) throw 'each ingredient should be 3 characters and the max 50 characters'
      if(!ingredient.match(/[a-zA-Z]+/)) throw 'one of the ingredient is not make sense, at least give me some english letters'
    });
    return ingredients
  },

  checkCookingSkillRequired(cookingSkillRequired) {
    if(cookingSkillRequired === "Novice" || cookingSkillRequired === "Intermediate" || cookingSkillRequired === "Advanced") {
      return cookingSkillRequired
    }
    throw 'cooking skill has to be:  "Novice" or "Intermediate" or "Advanced", case sensitive!'
  },

  checkSteps(steps) {
    if(!Array.isArray(steps)) throw 'steps must be an array'
    if(steps.length < 5) throw 'should be at least 5 valid elements in the steps array'
    steps.forEach(step => {
      if(!step) throw 'one of the steps is undefine'
      if (typeof step !== 'string') throw 'step must be a string';
      step = step.trim();
      if(step.length < 20) throw 'The minimum number of characters should be 20.  No max character constraint.'
      if(!step.match(/[a-zA-Z]+/)) throw 'one of the step is not make sense, at least give me some english letters'
    });
    
    return steps
  }
};

export default exportedMethods;