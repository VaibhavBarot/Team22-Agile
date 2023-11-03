const axios= require('axios').default;

const root = 'http://localhost:3000/';

describe('Test endpoints', () => {
    let testUserEmail;
    it('should return HTTP 200', async () => {
      const res = await axios
        .get(root)
        expect(res.status).toBe(200);

    });

    it('should return HTTP 404 for non existing routes', async () => {
        try {
            await axios
            .get(root + '/invalidRoute')
        }
        catch(e){
            expect(e.response.status).toBe(404);
        }
      });

      it('should create a new user account', async () => {
        testUserEmail = 'test@' + Math.floor(Math.random() * 100) + '.com'
        const res = await axios.post(root + 'sign-up',{
            emailIdInput:testUserEmail,
            passwordInput:'Test@123',
            firstName:'Test',
            lastName:'Test'
        })
        expect(res.status).toBe(200);
      })

      it('should sign into an account', async () => {
        const res = await axios.post(root + 'sign-in', {
            emailIdInput:testUserEmail,
            passwordInput:'Test@123'
        })
        expect(res.status).toBe(200);
      })

      it('should sign out of an account', async () => {
        const res = await axios.get(root + 'sign-out')
        expect(res.status).toBe(200);
      })

      it('load create event page', async () => {
        const res = await axios.get(root + 'create-event')
        expect(res.status).toBe(200);
      })

      it('should create an event', async () => {
        const res = await axios.post(root + 'create-event',{
            date:'test@' + Math.random() + '.com',
            name:'Test@123',
            time:'Test',
            venue:'Test'
        })
        expect(res.status).toBe(200);
      })
});