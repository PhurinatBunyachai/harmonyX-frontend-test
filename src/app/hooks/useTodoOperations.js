'use client';
import { useState } from 'react';
import { API_URL } from '../config/config';

/**
 * Custom hook for todo operations (create, edit, delete)
 * @returns {Object} Todo operation methods and state
 */
export default function useTodoOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Create a new todo
   * @param {Object} todoData - Todo data
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} - Creation result
   */
  const createTodo = async (todoData, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const query = `
        mutation CreateTodo($title: String!, $subTitle: String, $status: String!, $userId: Int!) {
          insert_mydbTodos_one(object: {title: $title, subTitle: $subTitle, status: $status, userId: $userId}) {
            id
            title
            subTitle
            status
          }
        }
      `;
      
      const variables = {
        title: todoData.title,
        subTitle: todoData.description || "",
        status: todoData.priority || "normal",
        userId: userId
      };
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-user-id': userId
        },
        body: JSON.stringify({ query, variables })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return { success: true, data: result.data?.insert_mydbTodos_one };
    } catch (err) {
      console.error('Error creating todo:', err);
      setError(err.message || 'Failed to create todo. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing todo
   * @param {Number} todoId - Todo ID
   * @param {Object} todoData - Updated todo data
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} - Update result
   */
  const updateTodo = async (todoId, todoData, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const query = `
        mutation UpdateTodo($id: Int!, $title: String!, $subTitle: String, $status: String!) {
          update_mydbTodos_by_pk(pk_columns: {id: $id}, _set: {title: $title, subTitle: $subTitle, status: $status}) {
            id
            title
            subTitle
            status
          }
        }
      `;
      
      const variables = {
        id: todoId,
        title: todoData.title,
        subTitle: todoData.description || "",
        status: todoData.status || todoData.priority || "normal"
      };
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-user-id': userId
        },
        body: JSON.stringify({ query, variables })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return { success: true, data: result.data?.update_mydbTodos_by_pk };
    } catch (err) {
      console.error('Error updating todo:', err);
      setError(err.message || 'Failed to update todo. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle todo status between 'todo' and 'done'
   * @param {Number} todoId - Todo ID
   * @param {String} currentStatus - Current todo status
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} - Toggle result
   */
  const toggleTodoStatus = async (todoId, currentStatus, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const newStatus = currentStatus === 'done' ? 'todo' : 'done';
      
      const query = `
        mutation ToggleTodoStatus($id: Int!, $status: String!) {
          update_mydbTodos_by_pk(pk_columns: {id: $id}, _set: {status: $status}) {
            id
            status
          }
        }
      `;
      
      const variables = {
        id: todoId,
        status: newStatus
      };
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-user-id': userId
        },
        body: JSON.stringify({ query, variables })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return { success: true, data: result.data?.update_mydbTodos_by_pk };
    } catch (err) {
      console.error('Error toggling todo status:', err);
      setError(err.message || 'Failed to update todo status. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a todo
   * @param {Number} todoId - Todo ID
   * @param {Number} userId - User ID
   * @returns {Promise<Object>} - Deletion result
   */
  const deleteTodo = async (todoId, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const query = `
        mutation DeleteTodo($id: Int!) {
          delete_mydbTodos_by_pk(id: $id) {
            id
          }
        }
      `;
      
      const variables = {
        id: todoId
      };
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-user-id': userId
        },
        body: JSON.stringify({ query, variables })
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
      
      return { success: true, data: result.data?.delete_mydbTodos_by_pk };
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError(err.message || 'Failed to delete todo. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTodo,
    updateTodo,
    toggleTodoStatus,
    deleteTodo
  };
}