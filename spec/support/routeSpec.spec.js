const axios= require('axios').default;
const jsdom = require('jsdom').JSDOM;

const root = 'http://localhost:3000/';
const axiosInstance = axios.create({ baseURL: root });
describe('Test endpoints', () => {
    let testUserEmail;
    let testEvent;
    it('should return HTTP 200', async () => {
      const res = await axios
        .get(root)
        expect(res.status).toBe(200);
        
    });

    it('should return HTTP 404 for non existing routes', async () => {
        try {
            await axios.get(root + '/invalidRoute')
        }
        catch(e){
            expect(e.response.status).toBe(404);
        }
      });

      it('should create a new user account', async () => {
        testUserEmail = 'test@' + Math.floor(Math.random() * 100) + '.com'
        const res = await axios.post(root + 'sign-up',{
            emailIdInput:testUserEmail,
            passwordInput:'Qwerty@123',
            firstName:'Test',
            lastName:'Test',
            city:'Hoboken'
        })
        expect(res.status).toBe(200);
      })

      it('nav items should be hidden for unauthenticated user ', async() => {
        const res = await axios.get(root)
        const dom = new jsdom(res.data);
        const document = dom.window.document;
        
        expect(document.getElementsByClassName('nav-item').length).toBe(0);
      })

      it('should sign into an account', async () => {
        const res = await axios.post(root + 'sign-in', {
            emailIdInput:testUserEmail,
            passwordInput:'Qwerty@123'
        })
       const cookie = res.headers["set-cookie"][0]; // get cookie from request
       axiosInstance.defaults.headers.Cookie = cookie;
        expect(res.status).toBe(200);
      })

      it('nav items should be visible for authenticated user ', async() => {
        const res = await axiosInstance.get(root)
        const dom = new jsdom(res.data);
        const document = dom.window.document;
        
        expect(document.getElementsByClassName('nav-item').length).toBeGreaterThan(0);
      })

      it('should sign out of an account', async () => {
        const res = await axios.get(root + 'sign-out')
        expect(res.status).toBe(200);
      })

      it('load create event page', async () => {
        const res = await axiosInstance.get(root + 'create-event')
        expect(res.status).toBe(200);
      })

      it('should create an event', async () => {
        const res = await axiosInstance.post(root + 'create-event',{
            date:'2023-10-31',
            name:'Pottery',
            time:'11:00',
            address:'549 Pineknoll St Caldwell, NJ 07006',
            host:'Test@123',
            description:'Come learn pottery'
        })
        expect(res.status).toBe(200);
      })

      it('newly created event should exists', async () => {
        const res = await axiosInstance.get(root + 'allevents')
        expect(res.status).toBe(200);

        const dom = new jsdom(res.data);

        const heading = dom.window.document.getElementsByTagName('h2')[0].innerHTML;
        expect(heading).toBe('Upcoming Events and Workshops near you:');

        const events = dom.window.document.getElementsByClassName('card');
        expect(events.length).toBeGreaterThan(0);

        const event = Array.from(events).find(e => e.innerHTML.includes('Pottery'));
        expect(event).toBeDefined();
        testEvent = event
      })

      it('load event details page', async () => {
        const eventId = testEvent.querySelector('a').getAttribute('href').replace('/allevents/','');

        const res = await axiosInstance.get(root+'allevents/' + eventId);
        expect(res.status).toBe(200);

        const dom = new jsdom(res.data);
        const document = dom.window.document;
        
        expect(document.querySelector('#name').innerHTML.includes('Pottery')).toBeTruthy();

        expect(document.querySelector('#date').innerHTML.includes('2023-10-31')).toBeTruthy();
        
        expect(document.querySelector('#time').innerHTML.includes('11:00')).toBeTruthy();

        expect(document.querySelector('#venue').innerHTML.includes('549 Pineknoll St Caldwell, NJ 07006')).toBeTruthy();

        expect(document.querySelector('#description').innerHTML.includes('Come learn pottery')).toBeTruthy();

        expect(document.querySelector('#host').innerHTML.includes('Test@123')).toBeTruthy();

      })

      it('user can register for an event', async () => {
        const eventId = testEvent.querySelector('a').getAttribute('href').replace('/allevents/','');
        const res = await axiosInstance.post(root+'allevents/'+eventId)

        expect(res.status).toBe(200);
      })

      it('user should be able to see their registered events', async () => {
        const res = await axiosInstance.get(root+'registeredevents')
        expect(res.status).toBe(200);

        const dom = new jsdom(res.data);
        const document = dom.window.document;

        const registeredEvents = Array.from(document.getElementsByClassName('events'));
        expect(registeredEvents.length).toBeGreaterThan(0);

        const event = registeredEvents.find(e => e.innerHTML.includes('Pottery'))
        expect(event).toBeDefined();
      })

      it('user should be able to unregister from event', async () =>{
        const eventId = testEvent.querySelector('a').getAttribute('href').replace('/allevents/','');
        const res = await axiosInstance.post(root + 'unregister', {
          eventId:eventId
        })
        expect(res.status).toBe(200);

        const dom = new jsdom(res.data);
        const document = dom.window.document;
        const registeredEvents = Array.from(document.getElementsByClassName('events'));
        expect(registeredEvents.length).toBe(0)
      })

      it('should load messages page', async () =>{
        const res = await axiosInstance.get(root + 'send-message')
        expect(res.status).toBe(200)     
      })

      it('message icon should be hidden for 0 incoming message', async() =>{
        const res = await axiosInstance.get(root)
        const dom = new jsdom(res.data);
        const document = dom.window.document;
        
        expect(document.getElementById('new-message')).toBeNull();
      })

      it('should throw 404 sending message to non-existing user', async () =>{
        try{
          await axios.post(root+'send-message' , {
            email:'non-existing-user',
            description:'empty'
          })
        } catch(e){
          expect(e.response.status).toBe(404);
        }
      })
});