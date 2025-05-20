import { Sequelize } from 'sequelize';

// Set up the Sequelize instance with the necessary database connection details
const sequelize = new Sequelize({
  dialect: 'mysql', // or 'postgres', 'sqlite', etc. based on your DB
  host: 'localhost', // your database host
  username: 'root', // your database username
  password: '97chocho', // your database password
  database: 'investment', // your database name
  logging: false, // set to true to see raw SQL queries in the console
});

export default sequelize;
