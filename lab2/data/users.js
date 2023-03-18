import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from './validation.js';
import bcrypt from 'bcrypt';
const saltRounds = 6;


async function checkUsernameRepeat(username) {
    const userCollection = await users();
    let user = await userCollection.findOne({username: username})
    if(user === null) {
        return username
    } else {
        throw 'this username already existed'
    }   
}

async function getUserById(userId) {
    const userCollection = await users();
    let user = await userCollection.findOne({ _id: ObjectId(userId) });
    if (user === null) throw 'No user with that id';
    const userInfoWithOutPassword = {_id: user._id, name: user.name, username : user.username}; 
    return userInfoWithOutPassword;
}


const exportedMethods = {
    async createUser(name, username, password) {
        try {
            name = validation.checkNameIsVaild(name)
            username = validation.checkUsernameIsVaild(username);
            username = await checkUsernameRepeat(username);
            password = validation.checkPasswordIsVaild(password);
        }catch(e) {
            throw e
        }
        const userCollection = await users();
        let newUser = {
            name: name,
            username : username,
            password : await bcrypt.hash(password, saltRounds)
        }
        const insertInfo = await userCollection.insertOne(newUser);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) {
            throw 'Could not add user';
        }
        
        return getUserById(insertInfo.insertedId.toString())
    },

    async checkUsernameAndPassword(username, password) {
        try {
            username = validation.checkUsernameIsVaild(username)
            password = validation.checkPasswordIsVaild(password)
        } catch (e) {
            throw e
        }
        const userCollection = await users();
        let userInfo = await userCollection.findOne({username: username})
        if(userInfo === null) {
            throw 'Either the username or password is invalid'
        }
        let encrypted_password = userInfo.password
        let passwordMatch = await bcrypt.compare(password, encrypted_password)
        if (!passwordMatch) {
            throw 'Either the username or password is invalid'
        } else {
            
            return {user:  await getUserById(userInfo._id)}
        }
        
    }





};

export default exportedMethods;