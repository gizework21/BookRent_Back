const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Add a new book
router.post('/', authMiddleware, async (req, res) => {
  const { title, author, description, category, ownerId, price, quantity } = req.body;

  try {
    if (price === undefined || price === null) {
      return res.status(400).json({ error: 'Price is required' });
    }
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const book = await prisma.book.create({
      data: { title, author, description, category, ownerId, price, quantity }
    });

    res.status(201).json(book);
  } catch (error) {
    console.error('Error creating book:', error); // Log the error
    res.status(400).json({ error: 'Error creating book', details: error.message });
  }
});


// Get all books with filtering
router.get('/', async (req, res) => {
  const { id, category, author, owner } = req.query;

  const filter = {};
  if (id) filter.id = parseInt(id);
  if (category) filter.category = category;
  if (author) filter.author = author;
  if (owner) filter.ownerId = parseInt(owner);

  try {
    const books = await prisma.book.findMany({
      where: filter,
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Get a book by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({ where: { id: parseInt(id) } });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// Update a book
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, author, description, available, category } = req.body;
  try {
    const book = await prisma.book.update({
      where: { id: parseInt(id) },
      data: { title, author, description, available, category }
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error: 'Error updating book' });
  }
});

// Delete a book
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({ where: { id: parseInt(id) } });
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: 'Error deleting book' });
  }
});

module.exports = router;
