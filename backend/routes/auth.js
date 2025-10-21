const express = require('express');
const router = express.Router();

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  const newObj = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
};

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = req.app.locals.pool;

    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // For demo purposes, we're not checking password
    // In production, you should hash passwords and compare them
    // For now, any password works for demo

    // Return user data (without sensitive info)
    const userData = toCamelCase({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      practice: user.practice,
      avatar: user.avatar,
      phone: user.phone,
      license: user.license,
      specialty: user.specialty,
      preferences: user.preferences
    });

    res.json({
      success: true,
      user: userData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout endpoint (for completeness, though frontend handles logout)
router.post('/logout', async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Verify session endpoint (optional, for checking if user is still authenticated)
router.get('/verify', async (req, res) => {
  // In a real app, you would verify JWT token or session here
  res.json({ authenticated: true });
});

module.exports = router;
