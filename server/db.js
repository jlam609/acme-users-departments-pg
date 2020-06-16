const {Client}= require('pg');
const PG_URL = process.env.PG_URL || 'postgres://localhost:5432/';
const DB_NAME = process.env.DB_NAME || 'acmeusers061521';
const uuid = require('uuid')



const db = new Client(`${PG_URL}${DB_NAME}`);
db.connect();

const createDepartment = async(name) => {
    if (typeof name !== 'string') throw new Error('must be a string')
    let id = uuid.v4()
    await db.query(`
    INSERT INTO departments ( id, name)
    VALUES ($1, $2);
    `, [id, name])
};

const getAllDepartments = async() => {
    const {rows} = await db.query(`
    SELECT * 
    FROM departments;
    `);
    return rows
};
const getAllUsers = async()=>{
    const {rows} = await db.query(`
    SELECT id, name, bio, department_id
    FROM users;
    `);
    return rows
};
const seed = async(force = false) => {
    if(force){
        await db.query(`
        DROP TABLE IF EXISTS departments;
        DROP TABLE IF EXISTS users;
        `);
    }
    await db.query(`
    CREATE TABLE IF NOT EXISTS departments(
        id UUID PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    )
    `);
    await db.query(`
    CREATE TABLE IF NOT EXISTS users(
        id UUID PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        bio  TEXT NOT NULL,
        department_id UUID REFERENCES departments(id)
    )
    `);
    console.log('seeding complete')
}

module.exports = {
    db,
    seed,
    getAllDepartments,
    getAllUsers
}