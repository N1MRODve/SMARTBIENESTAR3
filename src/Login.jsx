// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, loginWithRedirect, getCurrentSessionWithRedirect } from '../services/supabase';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();
  
  // Verificar si ya hay una sesión activa
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { user, redirectPath } = await getCurrentSessionWithRedirect();
        
        if (user) {
          // Ya hay una sesión activa, redirigir al dashboard correspondiente
          navigate(redirectPath);
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkSession();
  }, [navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Iniciar sesión y obtener la ruta de redirección
      const { redirectPath } = await loginWithRedirect(email, password);
      
      // Redirigir al dashboard correspondiente
      navigate(redirectPath);
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Credenciales incorrectas. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  // Mostrar un loader mientras se verifica la sesión
  if (checkingSession) {
    return (
      <div className="login-container">
        <div className="login-loading">
          <div className="loader"></div>
          <p>Verificando sesión...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SMART Bienestar</h1>
          <p>Plataforma de gestión del bienestar corporativo</p>
        </div>
        
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@email.com"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Iniciando sesión...</span>
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;