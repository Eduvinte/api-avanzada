// Importation of the librarys
const { Pool } = require('pg')
const format = require('pg-format')

// Connection of the DataBase
const pool = new Pool({
    localhost: 'localhost',
    user: 'postgres',
    password: '689101101024Edu',
    database: 'joyas',
    allowExitOnIdle: true
})

// Functions of the application

// This function obtain data with limits and order and count for page
const obtainJewelry = async ({ limits = 10, order_by = 'id_ASC', page = 1 }) => {
    try {
        const [field, order] = order_by.split('_')
        const offset = (page -1) * limits
        const consult = format("SELECT * FROM iventario order by %s %s LIMIT %s OFFSET %s", field, order, limits, offset)
        const { rows: resultJewelry } = await pool.query(consult)
        return resultJewelry
    } catch (error) {
        throw new Error('¡Error in the attempt to obtain Jewelries!')
    }
}

const obtainJewelryFilter = async ({ precio_max, precio_min, categoria, stock, metal }) => {
    try {
        let filters = []
        const values = []

        // This function is that to evited SQL injection 
        const insertFilter = (max, min, cat, sto, met, value) => {
            values.push(value)
            const { lenght } = filters
            filters.push(`${max} ${min} ${cat} ${sto} ${met} ${lenght + 1}`)
        }

        if(precio_max) filters.push(`precio <= ${precio_max}`)
        if(precio_min) filters.push(`precio >= ${precio_min}`)
        if(categoria) filters.push(`categoria =  '${categoria}'`)
        if(stock) filters.push(`stock = ${stock} `)
        if(metal) filters.push(`metal = '${metal}'`)
        

        let consult = "SELECT * FROM iventario"

        if(filters.length > 0){
            filters = filters.join(" AND ")
            consult += ` WHERE ${filters} `
        }

        const { rows: jewelry } = await pool.query(consult)
        return jewelry
        

    } catch (error) {
        throw new Error('¡Error in the attempt obtain data!')
    }
}

const hateoas = (jewelry) => {
    const results = jewelry.map((j) => {
        return {
            name: j.nombre,
            href: `/jewelry/jeweltys/${j.id}`
        }
    }).slice(0, 4)
    const total = jewelry.lenght
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS
}

// Exports of the application
module.exports = { obtainJewelry, obtainJewelryFilter, hateoas }