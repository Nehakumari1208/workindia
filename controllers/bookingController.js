import { pool } from '../utils/db.js';

export const createBooking = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { train_id, seat_number, source, destination } = req.body;
    const user_id = req.user.id;

    if (
      !train_id ||
      !seat_number ||
      !source ||
      !destination ||
      isNaN(train_id) ||
      isNaN(seat_number)
    ) {
      return res.status(400).json({ message: 'Invalid input fields' });
    }

    await connection.beginTransaction();

    const [trains] = await connection.query('SELECT * FROM trains WHERE id = ? FOR UPDATE', [train_id]);
    if (trains.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Train not found' });
    }

    const train = trains[0];
    if (seat_number < 1 || seat_number > train.total_seats) {
      await connection.rollback();
      return res.status(400).json({ message: 'Invalid seat number' });
    }

    const [bookedSeats] = await connection.query(
      'SELECT * FROM bookings WHERE train_id = ? AND seat_number = ? FOR UPDATE',
      [train_id, seat_number]
    );
    if (bookedSeats.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: 'Seat already booked' });
    }

    await connection.query(
      'INSERT INTO bookings (user_id, train_id, source, destination, seat_number) VALUES (?, ?, ?, ?, ?)',
      [user_id, train_id, source, destination, seat_number]
    );

    await connection.commit();
    res.status(201).json({ message: 'Booking successful' });
  } catch (err) {
    await connection.rollback();
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

export const getTrainsByRouteWithAvailability = async (req, res) => {
  try {
    const { source, destination } = req.query;

    if (!source || !destination) {
      return res.status(400).json({ message: 'Source and destination are required' });
    }

    const [trains] = await pool.query(
      `SELECT id, name, total_seats FROM trains WHERE source = ? AND destination = ?`,
      [source.trim(), destination.trim()]
    );

    if (trains.length === 0) {
      return res.status(404).json({ message: 'No trains found for this route' });
    }

    const trainIds = trains.map(t => t.id);

    const [bookings] = await pool.query(
      `SELECT train_id, COUNT(*) AS bookedSeats 
       FROM bookings 
       WHERE train_id IN (?) 
       GROUP BY train_id`,
      [trainIds]
    );

    const bookingsMap = {};
    bookings.forEach(b => {
      bookingsMap[b.train_id] = b.bookedSeats;
    });

    const result = trains.map(train => {
      const booked = bookingsMap[train.id] || 0;
      const available = train.total_seats - booked;
      return {
        trainId: train.id,
        name: train.name,
        totalSeats: train.total_seats,
        bookedSeats: booked,
        availableSeats: available
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching trains by route:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const [result] = await pool.query(
      `
      SELECT 
        b.id AS booking_id,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        t.name AS train_name,
        b.source,
        b.destination,
        b.seat_number
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN trains t ON b.train_id = t.id
      WHERE b.id = ?
      `,
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = result[0];
    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    delete booking.user_id;
    res.status(200).json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
