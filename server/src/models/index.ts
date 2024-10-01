import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)  // If using a full DB URL, use that
  : new Sequelize(
      process.env.DB_NAME || '', 
      process.env.DB_USER || '', 
      process.env.DB_PASSWORD || '', 
      {
        host: process.env.DB_HOST || 'localhost',   // Use the DB_HOST from environment
        port: parseInt(process.env.DB_PORT || '5432', 10),  // Use the DB_PORT from environment
        dialect: 'postgres', 
        dialectOptions: {
          decimalNumbers: true,
        },
      }
    );

const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser'});

export { sequelize, User, Ticket };
