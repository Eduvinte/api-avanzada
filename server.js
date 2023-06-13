// Importations of the librarys
const express = require('express')
const app = express()
const cors = require('cors')
const { obtainJewelry, obtainJewelryFilter, hateoas } = require('./index')

// Start the server
app.listen(3001, console.log('¡Servidor encendido con éxito!'))

// Middlewares
app.use(express())
app.use(cors())

// Routes of the aplication

// This route is for listning for data
app.get('/jewelry', async (req, res) => {
    try {
        const obtainQuery = req.query
        const jewelrys = await obtainJewelry(obtainQuery)
        const heteoas = hateoas(jewelrys)
        res.json(heteoas)
    } catch (error) {
        console.error(error)
        res.status(500).json(error.message)
    }

})

app.get('/jewelry/filter', async (req, res) => {
    try {
        const obtainQuery = req.query
        const jewelrys = await obtainJewelryFilter(obtainQuery)
        res.json(jewelrys)
    } catch (error) {
        console.error('Error attempt obtain this data')
        res.status(500).json( {error: 'Error attempt obain this data'} )
    }
})

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe")
    })
    