import jwt from 'jsonwebtoken';

const staffAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.staff = { id: decoded.id, departmentId: decoded.departmentId };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default staffAuth;
