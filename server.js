const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Contact = require('./models');

// Create a new Express app
const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Define routes for CRUD operations
app.get('/contacts', async (req, res) => {
    try {
      // Extract query parameters
      const { name, email, page = 1, limit = 10 } = req.query;
  
      // Construct Sequelize query options
      const options = {
        where: {},
        limit: Math.min(parseInt(limit), 100),
        offset: (parseInt(page) - 1) * limit,
      };
      if (name) {
        options.where.name = { [Op.iLike]: `%${name}%` };
      }
      if (email) {
        options.where.email = { [Op.iLike]: `%${email}%` };
      }
  
      // Execute the query
      const contacts = await Contact.findAll(options);
      res.json(contacts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.post('/contacts', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/contacts/:id', async (req, res) => {
  try {
    const [numUpdated, updatedContacts] = await Contact.update(req.body, {
      where: { id: req.params.id },
      returning: true,
    });
    if (numUpdated === 0) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.json(updatedContacts[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const numDeleted = await Contact.destroy({
      where: { id: req.params.id },
    });
    if (numDeleted === 0) {
      res.status(404).json({ error: 'Contact not found' });
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const port = process
