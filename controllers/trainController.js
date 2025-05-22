import { pool } from '../utils/db.js';

export const createTrain = async (req, res) => {
  const { name, source, destination, total_seats } = req.body;

  if (!name || !source || !destination || total_seats === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (isNaN(total_seats) || total_seats <= 0) {
    return res.status(400).json({ message: 'Total seats must be a positive number' });
  }

  try {
    await pool.query(
      `INSERT INTO trains (name, source, destination, total_seats) VALUES (?, ?, ?, ?)`,
      [name.trim(), source.trim(), destination.trim(), Number(total_seats)]
    );
    res.status(201).json({ message: 'Train created successfully' });
  } catch (err) {
    console.error('Create train error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

