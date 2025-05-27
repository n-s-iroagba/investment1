import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const  sequelize =
(process.env.NODE_ENV === 'production')?
new Sequelize({
  dialect: 'mysql',
  host: process.env.db_host,
  username: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
 
  
  logging: false,
}):new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '97chocho',
  database: 'investment',
  logging: false,
});

export default sequelize;
