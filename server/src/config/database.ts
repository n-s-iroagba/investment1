import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const sequelize =
//  (process.env.NODE_ENV === 'production') 
//
//       dialect: 'mysql',
//       pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//       },
//       logging: false,
//     })
//   : 
  new Sequelize({
      dialect: 'mysql',
      host: 'localhost',
      username: 'root',
      password: '97chocho',
      database: 'iv',
      logging: false,
    });

export default sequelize;