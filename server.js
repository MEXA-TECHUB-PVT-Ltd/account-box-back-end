const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const app = require('./app');

 const database = process.env.DATABASE

// Connect the database
mongoose.connect(database, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology:true,
}).then(con => {
    console.log('=====>>DB connection Successfully!');
    // Start the server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`
      ################################################
             Server listening on port: ${port}
      ################################################
    `);
    });

    process.on('unhandledRejection', err => {
        console.log('UNHANDLED REJECTION!!!  shutting down ..');
        console.log('====>',err);
        console.log(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });

});

