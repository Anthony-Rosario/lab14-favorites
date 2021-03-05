module.exports = [
  {
    name: 'Tatooine',
    diameter: '10465', 
    climate: 'arid', 
    gravity: '1', 
    terrain: 'desert',
    population: '200,000'
  }, 
  {
    name: 'Hoth',
    diameter: '7200', 
    climate: 'frozen', 
    gravity: '1.1', 
    terrain: 'tundra, ice caves, mountain ranges',
    population: 'unknown'
  }, 
  {
    name: 'Dagobah',
    diameter: '8900', 
    climate: 'murky', 
    gravity: '1', 
    terrain: 'swamp, jungles',
    population: 'unknown'
  }, 
  {
    name: 'Naboo',
    diameter: '12120', 
    climate: 'temperate', 
    gravity: '1', 
    terrain: 'grassy hills, swamps, forests, mountains',
    population: '4,500,000,000'
  } 
];




// CREATE TABLE planets (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(256) NOT NULL,
//     diameter INTEGER NOT NULL
//     climate VARCHAR(512) NOT NULL
//     gravity INTEGER NOT NULL
//     terrain VARCHAR(512) NOT NULL
//     population INTEGER NOT NULL
//     owner_id INTEGER NOT NULL REFERENCES users(id)
// );