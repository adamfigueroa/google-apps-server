const app = require('../app');
const supertest = require('supertest');
const { expect } = require('chai');

describe('Express App', () => {
    it('Should have a 200 status and contain an array', () => {
        return supertest(app)
        .get('/apps')
        .expect(200)
        .then(response => {
            expect(response.body).to.be.an('array');
            expect(response.body[0]).to.be.an('object');
            expect(response.body[0]).to.include.all.keys(
                'App',
                'Category',
                'Rating',
                'Reviews',
                'Size',
                'Installs',
                'Type',
                'Price',
                'Genres'
            );
        });
    });
});

const queries = ['sort', 'genre'];
queries.forEach(query => {
    it('Should have a status 400 if the query is not valid' , () => {
        return supertest(app)
        .get('/apps')
        .query({ [query]: 'foo' })
        .expect(400)
    });
});