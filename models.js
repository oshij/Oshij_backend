const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize('contacts_book', 'root', '<password>', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define the Contact model
const Contact = sequelize.define('Contact', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Sync the model with the database
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((err) => {
    console.error('Database sync failed:', err);
  });

module.exports = Contact;
