// /src/services/mock/auth.service.js
const users = {
  'admin@demo.com': { id: 'user-admin-01', email: 'admin@demo.com', role: 'administrador', name: 'Admin Demo' },
  'empleado@demo.com': { id: 'user-empleado-01', email: 'empleado@demo.com', role: 'empleado', name: 'Empleado Demo' }
};

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users[email]) {
        console.log(`Mock Login success for: ${email}`);
        resolve({ user: users[email], session: { access_token: 'fake-jwt-token' } });
      } else {
        console.error(`Mock Login failed for: ${email}`);
        reject({ message: 'Usuario o contraseña inválidos' });
      }
    }, 500);
  });
};