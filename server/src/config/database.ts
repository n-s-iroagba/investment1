import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const  sequelize =
(process.env.NODE_ENV === 'production')?
new Sequelize(process.env.db_string):new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '97chocho',
  database: 'iv',
  logging: false,
});

export default sequelize;
