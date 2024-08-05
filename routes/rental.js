const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rent a book
router.post('/', authMiddleware, async (req, res) => {
  const { bookId, startAt, endAt } = req.body;
  try {
    const rental = await prisma.rental.create({
      data: {
        bookId: parseInt(bookId),
        userId: req.user.id,
        startAt: new Date(startAt),
        endAt: new Date(endAt)
      }
    });
    await prisma.book.update({
      where: { id: parseInt(bookId) },
      data: { available: false }
    });
    res.status(201).json(rental);
  } catch (error) {
    res.status(400).json({ error: 'Error renting book' });
  }
});

// Return a book
router.put('/:id/return', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const rental = await prisma.rental.update({
      where: { id: parseInt(id) },
      data: { status: 'returned' }
    });
    await prisma.book.update({
      where: { id: rental.bookId },
      data: { available: true }
    });
    res.status(200).json(rental);
  } catch (error) {
    res.status(400).json({ error: 'Error returning book' });
  }
});

// Get all rentals for a user
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const rentals = await prisma.rental.findMany({
      where: { userId: req.user.id },
      include: { book: true }
    });
    res.status(200).json(rentals);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching rentals' });
  }
});

module.exports = router;
