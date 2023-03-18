import { JS } from 'aws-amplify';
import { createClient } from 'redis';

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();


const obj1 = {"name": "ziheng", "age": 18}
const obj2 = {"name": "linyu", "age": 2}
const arr1 = [obj1, obj2];

await client.set('key', 'value');
await client.hSet("recipes-page", "1", JSON.stringify(arr1))
// const value = await client.get('key');
const value = await client.hGet("recipes-page", "1")

const res = JSON.parse(value)
console.log(res)







await client.disconnect();