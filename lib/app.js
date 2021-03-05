const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const request = require('superagent');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();


app.use('/auth', authRoutes);


app.use('/api', ensureAuth);


app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});



app.get('/people', async(req, res) => {
  try {
    const data = await request.get(`https://swapi.dev/api/people/?search=${req.query.search}`);
    
    res.json(data.body);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.get('/api/favorites', async(req, res) => {
  try {
    const data = await client.query('SELECT * from favorites WHERE owner_id=$1', [req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.delete('/api/favorites/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE from favorites WHERE owner_id=$1 AND id=$2', [req.params.id, req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.post('/api/favorites', async(req, res) => {
  try {
    const data = await client.query(`
    INSERT INTO favorites (name, birth_year, height, mass, hair_color, skin_color, homeworld, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
    `, 
    [req.body.name, req.body.birth_year, req.body.height, req.body.mass, req.body.hair_color, req.body.skin_color, req.body.homeworld, req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.put('/api/favorites/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE favorites
    WHERE id = $1
    AND user_id = $2 ;
    `, 
    [req.params.id, req.userId]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});



app.use(require('./middleware/error'));

module.exports = app;
