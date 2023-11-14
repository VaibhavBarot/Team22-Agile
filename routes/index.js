const home = require('./home');
const events = require('./events');
const reports = require('./reports');;

const constructorMethod = (app) =>{
    app.use('/',home);
    app.use('/allevents',events);
    app.use("/reports", reports);
    app.use('*', (req, res) => {
        return res.status(404).render('./errorPage', {title: "Error", error: "Oops! the page you are searching doesn't exist"});
        
      });
};

module.exports = constructorMethod;
