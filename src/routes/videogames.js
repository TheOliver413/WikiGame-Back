const { APIKEY } = process.env;
const { Router } = require('express');
const router = Router();
const axios = require('axios').default;
const { Videogame, Genre } = require('../db');


//GET a "/videogames" 

router.get('/', async (req, res) => {
    // DB 
    let videogamesDb = await Videogame.findAll({
        include: Genre
    });
    //Parseo el objeto
    videogamesDb = JSON.stringify(videogamesDb);
    videogamesDb = JSON.parse(videogamesDb);
    //dejo el arreglo de generos
    videogamesDb = videogamesDb.reduce((acc, el) => acc.concat({
        ...el,
        genres: el.genres.map(g => g.name)
    }), [])
    
    //GET /videogames?name="..." 
    // si llegan queries "name"
    if (req.query.name) {
        try {
            //API
            let response = await axios.get(`https://api.rawg.io/api/games?search=${req.query.name}&key=${APIKEY}`);
            if (!response.data.count) return res.status(204).json(`Juego no encontrado "${req.query.name}"`);
            //filtro solo lo del front
            const gamesREADY = response.data.results.map(game => {
                return{
                    id: game.id,
                    name: game.name,
                    background_image: game.background_image,
                    rating: game.rating,
                    genres: game.genres.map(g => g.name)
                }
            });

            //solo filtro los que coincidan con la busqueda
            const filteredGamesDb = videogamesDb.filter(g => g.name.toLowerCase().includes(req.query.name.toLowerCase()));
            //DB, sumo todos, y corto el array en 15
            const results = [...filteredGamesDb, ...gamesREADY.splice(0, 15)];
            return res.json(results)
        } catch (err) {
            return console.log(err)
        }
    } else {
        //Buscar en la API
        try {
            let pages = 0;
            let results = [...videogamesDb]; //+ DB
            let response = await axios.get(`https://api.rawg.io/api/games?key=${APIKEY}`);
            while (pages < 6) {
                pages++;
                //filtro solo lo del front
                const gammesREADY = response.data.results.map(game => {
					return{
						id: game.id,
						name: game.name,
						background_image: game.background_image,
						rating: game.rating,
                        genres: game.genres.map(g => g.name)
					}
				});
                results = [...results, ...gammesREADY]
                response = await axios.get(response.data.next) //llamar a la API con next
            }
            return res.json(results)
        } catch (err) {
            console.log(err)
            return res.sendStatus(500)
        }
    }
});

module.exports = router;