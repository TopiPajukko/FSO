const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs',{ url: 1, title: 1, author: 1, id: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const users = await User.find({})

    if(password === undefined || username === undefined){
        return response.status(400).json({ error: 'password and username needed' })
    }
    else if(password.length < 3 || username.length < 3){
        return response.status(400).json({ error: 'password or username must be at least 3 characters long' })
    }
    else if(users.find((elem) => elem.username === username)){
        return response.status(400).json({ error: 'username must be unique'})
    }else{
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User({
            username,
            name,
            passwordHash,
        })
        const savedUser = await user.save()

        response.status(201).json(savedUser)    
    }
})

module.exports = usersRouter