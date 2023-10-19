const axios= require('axios').default;

const root = 'http://localhost:3000/';

describe('Test endpoints', () => {
    it('should return HTTP 200', async () => {
      const res = await axios
        .get(root)
        expect(res.status).toBe(200);

    });

    it('return HTTP 404 for non existing routes', async () => {
        try {
            await axios
            .get(root + '/invalidRoute')
        }
        catch(e){
            expect(e.response.status).toBe(404);
        }
      });
});