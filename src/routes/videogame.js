require('dotenv').config();
const { APIKEY } = process.env;
const { Router } = require('express');
const router = Router();
const axios = require('axios').default;
const { Videogame, Genre } = require('../db');



//GET /videogame/:idVideoGame 

// consulto el detalle del juego por el ID
router.get('/:idVideogame', async (req, res) => {
    const { idVideogame } = req.params
    
    //verifico DB
    if (idVideogame.includes('-')) {
        let videogameDb = await Videogame.findOne({
            where: {
                id: idVideogame,
            },
            include: Genre
        })
        //Parseo el objeto
        videogameDb = JSON.stringify(videogameDb);
        videogameDb = JSON.parse(videogameDb);
        
        //dejo un array con los nombres de genero solamente
        videogameDb.genres = videogameDb.genres.map(g => g.name);
        res.json(videogameDb)
    } else {
        //else API)
        try {
            const response = await axios.get(`https://api.rawg.io/api/games/${idVideogame}?key=${APIKEY}`);
            let { id, name, background_image, genres, description, released: releaseDate, rating, platforms } = response.data;
            genres = genres.map(g => g.name); // mapeo solo el nombre del genero
            platforms = platforms.map(p => p.platform.name); // mapeo solo el nombre de la plataforma
            return res.json({
                id,
                name,
                background_image,
                genres,
                description,
                releaseDate,
                rating,
                platforms
            })
        } catch (err) {
            return console.log(err)
        }
    }
    
})

// POST /videogame 
router.post('/', async (req, res) => {
    let { name, description, releaseDate, rating, genres, platforms } = req.body;
    platforms = platforms.join(', ')
    try {
        const gameCreated = await Videogame.findOrCreate({ 
            where: {
                name,
                description,
                releaseDate,
                rating,
                platforms,
            }
        })
        await gameCreated[0].setGenres(genres); // relaciono ID genres al juego creado
    } catch (err) {
        console.log(err);
    }
    res.send('Creada con éxito')
})

module.exports = router;