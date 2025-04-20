'use client';

export default function TodoCard({ task, onToggleStatus, onEdit, onDelete }) {
  const isDone = task.status === 'done';
  const isHighPriority = task.status === 'high';
  
  // Determine background color based on task status
  const bgColor = isDone ? 'bg-green-600' : (isHighPriority ? 'bg-orange-600' : 'bg-blue-600');
  
  // Determine status text color
  const statusTextColor = isDone ? 'text-green-200' : (isHighPriority ? 'text-orange-200' : 'text-blue-200');
  
  // Determine checkmark color
  const checkmarkColor = isDone ? 'text-green-600' : 'text-gray-300';
  
  return (
    <div key={task.id} className={`rounded-lg p-4 ${bgColor} text-white`}>
      <div className="flex justify-between">
        <div>
          <div className={`text-xs uppercase mb-1 ${statusTextColor}`}>
            {isDone ? 'DONE' : task.status}
          </div>
          <h3 className="font-bold">{task.title}</h3>
          <p className="text-sm mt-1 opacity-90">{task.subTitle}</p>
        </div>
        <div className="flex flex-col space-y-2 self-center">
          <button 
            onClick={() => onToggleStatus(task.id)}
            className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer"
            title={isDone ? "Mark as todo" : "Complete task"}
          >
            {!isDone && <span className="sr-only">Complete task</span>}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${checkmarkColor}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={() => onEdit(task)}
            className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer"
            title="Edit task"
          >
            <span className="sr-only">Edit task</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer"
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
  );
}