export const verifyApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

  if (!apiKey || apiKey !== ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }

  next();
};
