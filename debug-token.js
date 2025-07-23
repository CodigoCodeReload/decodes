// Script temporal para debuggear el token JWT
const jwt = require('jsonwebtoken');

// Simular la generación de token como lo hace el servidor
const JWT_SECRET = 'supersecret';

// Generar un token de prueba
const testToken = jwt.sign(
  { sub: 'test-user-id', username: 'testuser' },
  JWT_SECRET,
  { expiresIn: '24h' }
);

console.log('Generated token:', testToken);

// Verificar el token
try {
  const decoded = jwt.verify(testToken, JWT_SECRET);
  console.log('Decoded payload:', decoded);
  console.log('Has sub:', !!decoded.sub);
  console.log('Has userId:', !!decoded.userId);
  console.log('Has username:', !!decoded.username);
} catch (error) {
  console.log('Verification error:', error.message);
}
