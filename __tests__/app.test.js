require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'bob@goog.com',
          name: 'bob',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('get person for user', async() => {
      const expectation = 
      {
        'count': 1,
        'next': null,
        'previous': null,
        'results': [
          {
            'name': 'R2-D2',
            'height': '96',
            'mass': '32',
            'hair_color': 'n/a',
            'skin_color': 'white, blue',
            'eye_color': 'red',
            'birth_year': '33BBY',
            'gender': 'n/a',
            'homeworld': 'http://swapi.dev/api/planets/8/',
            'films': [
              'http://swapi.dev/api/films/1/',
              'http://swapi.dev/api/films/2/',
              'http://swapi.dev/api/films/3/',
              'http://swapi.dev/api/films/4/',
              'http://swapi.dev/api/films/5/',
              'http://swapi.dev/api/films/6/'
            ],
            'species': [
              'http://swapi.dev/api/species/2/'
            ],
            'vehicles': [],
            'starships': [],
            'created': '2014-12-10T15:11:50.376000Z',
            'edited': '2014-12-20T21:17:50.311000Z',
            'url': 'http://swapi.dev/api/people/3/'
          }
        ]
      };
      const data = await fakeRequest(app)
        .get('/people/?search=r2-d2')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });



    test('add a favorite', async() => {
      const expectation = 
      [
        {
          id: 5,
          name: 'scandark',
          birth_year: '14BBY',
          height: 123,
          mass: 56,
          hair_color: 'black',
          skin_color: 'fair',
          homeworld: 'tatooine',
          owner_id: 2
        }];

        
      const newFav = {
        name: 'scandark',
        birth_year: '14BBY',
        height: 123,
        mass: 56,
        hair_color: 'black',
        skin_color: 'fair',
        homeworld: 'tatooine',
        owner_id: 2
      };

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .send(newFav)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation);
      
    });



    test('gets all favorites', async() => {
      const expectation = [
        {
          'id': 5,
          'name': 'scandark',
          'birth_year': '14BBY',
          'height': 123,
          'mass': 56,
          'hair_color': 'black',
          'skin_color': 'fair',
          'homeworld': 'tatooine',
          'owner_id': 2
        }];

      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });


    test('delete a favorite', async() => {

      

      const expected = {
        'id': 5,
        'name': 'scandark',
        'birth_year': '14BBY',
        'height': 123,
        'mass': 56,
        'hair_color': 'black',
        'skin_color': 'fair',
        'homeworld': 'tatooine',
        'owner_id': 2
      };

      const data = await fakeRequest(app)
        .delete('/api/favorites/5')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expected);
    });
  });
});