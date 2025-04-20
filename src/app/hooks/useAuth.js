'use client';
import { useState } from 'react';
import { API_URL } from '../config/config';

/**
 * Custom hook for authentication (login and registration)
 * @returns {Object} Authentication methods and state
 */
export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration result
   */
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const query = `
        mutation RegisterUser($username: String!, $email: String!, $password: String!) {
          insert_users_one(object: {username: $username, email: $email, password: $password}) {
            id
            username
            email
          }
        }
      `;
      
      const variables = {
        username: userData.username,
        email: userData.email,
        password: userData.password
      };
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return { success: true, data: result.data?.insert_users_one };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log in a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} - Login result
   */
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const query = `
        query LoginUser($email: String!, $password: String!) {
          users(where: {email: {_eq: $email}, password: {_eq: $password}}) {
            id
            username
            email
          }
        }
      `;
      
      const variables = {
        email: credentials.email,
        password: credentials.password
      };
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      const userData = result.data?.users?.[0];
      
      if (!userData) {
        throw new Error('Invalid email or password');
      }
      
      // Store user data in state
      setUser(userData);
      
      // In a real app, you would store the user token in localStorage or cookies
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, data: userData };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout
  };
}