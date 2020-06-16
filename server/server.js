const express = require('express')
const path = require('path')
const {db, seed, getAllDepartments, getAllUsers} = require('./db.js')
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.static(path.join(__dirname, '../src')))



app.get('/api/departments', async(req,res) => {
    const departments = await getAllDepartments()
    res.send({departments})
})
app.get('/api/users', async(req,res) => {
    const users = await getAllUsers()
    res.send({users})
})
const startServer = () => new Promise((res) => {
    app.listen(PORT, () => {
        console.log('listening')
    })
})

seed()
.then(startServer)
.catch(e => {
    console.error('Failed to send', e)
    db.end()
    throw e
})