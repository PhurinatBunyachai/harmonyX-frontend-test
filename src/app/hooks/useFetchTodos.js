'use client';
import { useState } from 'react';
import { API_URL } from '../config/config';

/**
 * Custom hook for fetching tasks from the GraphQL API
 * @returns {Object} - Object containing todos, loading state, error state, and refetch function
 */
export default function useFetchTasks({userId}) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch tasks from the GraphQL API
   */
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const query = `
       query GetUserTodos {
          mydbTodos(where:{userId :{_eq:${userId}}}){
            id
            title
            subTitle
            status
          }
        }
      `;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-user-id' : userId
        },
        body: JSON.stringify({ query })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      // If API returns todos, use them; otherwise, use empty array
      if (result.data && result.data.mydbTodos && result.data.mydbTodos.length > 0) {
        setTodos(result.data.mydbTodos);
      } else {
        // Fallback to empty array if API returns empty
        setTodos([]);
      }
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load todos. Please try again later.');
      // Fallback to empty array
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    todos,
    loading,
    error,
    fetchTodos,
    setTodos // Expose setTodos to allow updates from components
  };
}