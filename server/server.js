require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 3002
const cors = require('cors')

//create an instance
const app = express()

const db = require('./db/index')

app.use(cors())
//using express builtin middleware
app.use(express.json())


//getallrestaurants
app.get('/api', async (req, res) => {
    try {
        const result = await db.query('select * from restaurants')
        res.status(200).json(result.rows)

    }


    catch (err) {
        console.log(err)
    }

})
//getresto by name
app.get('/api/getbyname/:name', async (req, res) => {

    try {
        const result = await db.query('select * from restaurants where name= $1', [req.params.name])
        res.json({
            status: "success",
            restaurant: result.rows
        })

    } catch (err) {
        console.log(err)
    }

})

app.get('/api/:id', async (req, res) => {

    try {
        const result = await db.query('select * from restaurants where id= $1', [req.params.id])
        const response= await db.query('select * from reviews where restaurant_id = $1', [req.params.id])
        res.json({resto:result.rows,review:response.rows})

    } catch (err) {
        console.log(err)
    }

})

//create resto
app.post('/api/createresto', async (req, res) => {
    try {
        const result = await db.query('insert into restaurants (name, location, price_range) values ($1, $2, $3) returning *', [req.body.name, req.body.location, req.body.price_range])
        res.status(201).json({ result: result.rows })
        console.log(result.rows)
    } catch (err) {
        console.log(err)
    }

})


//update resto
app.put('/api/updateresto/:id', async (req, res) => {
    try {
        const result = await db.query('update restaurants set name=$1, location=$2, price_range=$3 where id=$4 returning *', [req.body.name, req.body.location, req.body.price_range, req.params.id])
        res.status(204).json({ message: "updated the resto" })
        console.log(result.rows)
    } catch (err) {
        console.log(err)
    }

})


//delete resto
app.delete('/api/deleteresto/:id', async (req, res) => {
    try {
        const result = await db.query('delete from restaurants where id= $1 returning *', [req.params.id])
        console.log(result.rows)
    }
    catch (err) {
        console.log(err)
    }

})


//add reviews
app.post('/review',async(req,res)=>{
    try{
        const response = await db.query('insert into reviews (name,review,restaurant_id) values ($1,$2,$3) returning *', [req.body.name, req.body.review, req.body.restaurant_id])
        res.json({
            res:response.rows
        })

       
    }catch(err){
        console.log(err)
    }
})
app.listen(port, () => {
    console.log(`app is listening on port  ${port}`)
})