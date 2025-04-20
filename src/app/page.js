'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskModal from './components/TaskModal';
import TodoCard from './components/TodoCard';
import useFetchTodos from './hooks/useFetchTodos';
import useTodoOperations from './hooks/useTodoOperations';

export default function Home() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentDate);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(currentDate);
  const year = currentDate.getFullYear();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  // Use the custom hook for fetching tasks
  const { todos, loading, error, fetchTodos, setTodos } = useFetchTodos({userId:1});
  
  // Fetch todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);


  const todoTasks = todos.filter(task => !(task.status === 'done'));
  const doneTasks = todos.filter(task => task.status === 'done');

  // Import the custom hook for todo operations
  const { loading: operationLoading, error: operationError, createTodo, updateTodo, toggleTodoStatus, deleteTodo } = useTodoOperations();

  const toggleTaskStatus = async (id) => {
    const task = todos.find(t => t.id === id);
    if (!task) return;
    
    const result = await toggleTodoStatus(id, task.status, 1); // Using userId 1 for demo
    
    if (result.success) {
      // Update local state
      setTodos(todos.map(task => {
        if (task.id === id) {
          return {
            ...task,
            status: task.status === 'done' ? 'todo' : 'done'
          };
        }
        return task;
      }));
    }
  };

  const deleteTask = async (id) => {
    const result = await deleteTodo(id, 1); // Using userId 1 for demo
    
    if (result.success) {
      // Update local state
      setTodos(todos.filter(task => task.id !== id));
    }
  };

  const editTask = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (formData) => {
    if (currentTask) {
      // Edit existing task
      const result = await updateTodo(currentTask.id, formData, 1); // Using userId 1 for demo
      
      if (result.success) {
        // Update local state
        setTodos(todos.map(task => {
          if (task.id === currentTask.id) {
            return {
              ...task,
              title: formData.title,
              subTitle: formData.description || "",
              status: task.status
            };
          }
          return task;
        }));
      }
    } else {
      // Add new task
      const result = await createTodo(formData, 1); // Using userId 1 for demo
      
      if (result.success) {
        // If API call was successful but we need to use local ID generation for demo
        const newTask = {
          id: result.data?.id || (todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1),
          title: formData.title,
          subTitle: formData.description || "",
          status: formData.status
        };
        setTodos([...todos, newTask]);
      }
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="text-5xl font-bold text-gray-800">{day}</div>
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-700">{weekday}</div>
              <div className="text-xs text-gray-500">{month} {year}</div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
          <button 
            onClick={openNewTaskModal}
            className="flex items-center cursor-pointer justify-center bg-purple-600 hover:bg-purple-700 text-white rounded-full h-8 px-3 text-xs font-medium shadow-md transition-colors"
          >
            <span className="font-bold">+</span> 
          </button>
         
          <span className="text-black text-sm font-bold"> NEW TASK</span> 
          </div>
        </div>

        <div className="border-t border-gray-200 mb-4"></div>

        <div className="mb-6">
          <h2 className="text-center font-bold text-gray-800 mb-4">TODO TASKS</h2>
          <div className="space-y-3">
            {todoTasks.map(task => (
              <TodoCard
                key={task.id}
                task={task}
                onToggleStatus={toggleTaskStatus}
                onEdit={editTask}
                onDelete={deleteTask}
              />
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
              <TodoCard
                key={task.id}
                task={task}
                onToggleStatus={toggleTaskStatus}
                onEdit={editTask}
                onDelete={deleteTask}
              />
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
