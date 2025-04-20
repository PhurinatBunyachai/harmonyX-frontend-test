'use client';
import { useState,useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskModal from './components/TaskModal';
import { API_URL } from './config/config';

export default function Home() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate);
  const year = currentDate.getFullYear();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch tasks from GraphQL API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const query = `
         query GetUserTodos {
            mydbTodos(where:{userId :{_eq:1}}){
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
            'x-hasura-ddn-token' : 'eyJhbGciOiJFZERTQSIsImtpZCI6IjlkX2JMaEVGbWpSelMwanpxajlOSk15Vmt4TUpDZGpJeVkweFZxMFpWNlEiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhYTk0MDQ5OC1mNzZjLTQ0ODItYTYxMS0zOTMyNGM5ZDRlNWEiLCJleHAiOjE3NDUxNDU5NTIsImlhdCI6MTc0NTE0MjM1MiwiaXNzIjoiaHR0cHM6Ly9hdXRoLnByby5oYXN1cmEuaW8vZGRuL3Rva2VuIiwic3ViIjoiMzEzYWIwMTktMGRkNS00MWNmLTgzY2MtYjJlYTdjYzk0OTAzIn0.nqUKF4Wck7D72DTjkEBtvKbNMPFlL1ynJd-L56bblL72bYwzMMY57uW1QuQe9VNqG9inLxl4zLDb15Raf-PBCA'
          },
          body: JSON.stringify({ query })
        });
        
        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        
        // If API returns no tasks, use sample data
        if (result.data && result.data.mydbTodos && result.data.mydbTodos.length > 0) {
          setTasks(result.data.mydbTodos);
        } else {
          // Fallback to sample data if API returns empty
          setTasks([]);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        // Fallback to empty array
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  const todoTasks = tasks.filter(task => !(task.status === 'done'));
  const doneTasks = tasks.filter(task => task.status === 'done');

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          // status: task.status === 'todo' ? 'done' : 'todo'
        };
      }
      return task;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (formData) => {
    if (currentTask) {
      // Edit existing task
      setTasks(tasks.map(task => {
        if (task.id === currentTask.id) {
          return {
            ...task,
            ...formData
          };
        }
        return task;
      }));
    } else {
      // Add new task
      const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        ...formData,
        status: 'todo'
      };
      setTasks([...tasks, newTask]);
    }
  };

  const openNewTaskModal = () => {
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {/* Date Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="text-5xl font-bold text-gray-800">{day}</div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-700">{weekday}</div>
              <div className="text-xs text-gray-500">{month} {year}</div>
            </div>
          </div>
          <button 
            onClick={openNewTaskModal}
            className="flex items-center cursor-pointer justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-full h-8 px-3 text-xs font-medium shadow-md transition-colors"
          >
            <span className="mr-1 font-bold">+</span> NEW TASK
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Todo Tasks Section */}
        <div className="mb-6">
          <h2 className="text-center font-bold text-gray-800 mb-4">TODO TASKS</h2>
          <div className="space-y-3">
            {todoTasks.map(task => (
              <div 
                key={task.id} 
                className={`rounded-lg p-4 ${task.status === 'high' ? 'bg-orange-600' : 'bg-blue-600'} text-white`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className={`text-xs uppercase mb-1 ${task.status === 'high' ? 'text-orange-200' : 'text-blue-200'}`}>
                      {task.status}
                    </div>
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-sm mt-1 opacity-90">{task.subTitle}</p>
                  </div>
                  <div className="flex flex-col space-y-2 self-center">
                    <button 
                      onClick={() => toggleTaskStatus(task.id)}
                      className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md"
                      title="Complete task"
                    >
                      <span className="sr-only">Complete task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => editTask(task)}
                      className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md"
                      title="Edit task"
                    >
                      <span className="sr-only">Edit task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md"
                      title="Delete task"
                    >
                      <span className="sr-only">Delete task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-4"></div>

        {/* Done Tasks Section */}
        <div>
          <h2 className="text-center font-bold text-gray-800 mb-4">DONE TASKS</h2>
          <div className="space-y-3">
            {doneTasks.map(task => (
              <div 
                key={task.id} 
                className="rounded-lg p-4 bg-green-600 text-white"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="text-xs uppercase mb-1 text-green-200">
                      DONE
                    </div>
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-sm mt-1 opacity-90">{task.subTitle}</p>
                  </div>
                  <div className="flex flex-col space-y-2 self-center">
                    <button 
                      onClick={() => toggleTaskStatus(task.id)}
                      className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md"
                      title="Mark as todo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => editTask(task)}
                      className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md"
                      title="Edit task"
                    >
                      <span className="sr-only">Edit task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md"
                      title="Delete task"
                    >
                      <span className="sr-only">Delete task</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      
      {/* Task Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={currentTask}
        onSave={handleSaveTask}
      />
    </div>
  );
}
