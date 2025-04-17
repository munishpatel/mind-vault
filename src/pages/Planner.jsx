import React, { useState, useEffect } from "react";
import "./Planner.css";

const getToday = () => new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const Planner = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [habitInput, setHabitInput] = useState("");
  const [today, setToday] = useState(getToday());
  const [activeTab, setActiveTab] = useState("tasks");

  useEffect(() => {
    const storedTasks = localStorage.getItem(`planner_tasks_${today}`);
    const storedHabits = localStorage.getItem("planner_habits");

    if (storedTasks) setTasks(JSON.parse(storedTasks));
    if (storedHabits) setHabits(JSON.parse(storedHabits));
  }, [today]);

  useEffect(() => {
    localStorage.setItem(`planner_tasks_${today}`, JSON.stringify(tasks));
  }, [tasks, today]);

  useEffect(() => {
    localStorage.setItem("planner_habits", JSON.stringify(habits));
  }, [habits]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: taskInput, done: false }]);
    setTaskInput("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addHabit = (e) => {
    e.preventDefault();
    if (!habitInput.trim()) return;
    setHabits([...habits, { 
      id: Date.now(), 
      name: habitInput, 
      streak: 0, 
      lastCompleted: null 
    }]);
    setHabitInput("");
  };

  const toggleHabit = (id) => {
    const today = getToday();
    setHabits(habits.map(habit => {
      if (habit.id !== id) return habit;
      
      if (habit.lastCompleted === today) {
        return { 
          ...habit, 
          lastCompleted: null, 
          streak: Math.max(0, habit.streak - 1) 
        };
      } else {
        return { 
          ...habit, 
          lastCompleted: today, 
          streak: habit.streak + 1 
        };
      }
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="planner-app">
      <header className="planner-header">
        <div className="date-display">
          <h1>Daily Planner</h1>
          <p className="current-date">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
          <button 
            className={`tab ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
          >
            Habits
          </button>
        </div>
      </header>

      <main className="planner-content">
        {activeTab === 'tasks' && (
          <section className="tasks-section">
            <form onSubmit={addTask} className="task-form">
              <div className="input-container">
                <input
                  type="text"
                  value={taskInput}
                  placeholder="What needs to be done?"
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="task-input"
                />
                <button type="submit" className="add-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </form>

            <div className="task-stats">
              <span>{tasks.filter(t => !t.done).length} remaining</span>
              <span>{tasks.filter(t => t.done).length} completed</span>
            </div>

            <ul className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12V15M12 15V18M12 15H15M12 15H9" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <p>No tasks yet. Add one above!</p>
                </div>
              ) : (
                tasks.map(task => (
                  <li key={task.id} className={`task-item ${task.done ? 'completed' : ''}`}>
                    <div className="task-checkbox" onClick={() => toggleTask(task.id)}>
                      {task.done ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13L9 17L19 7" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <div className="unchecked-box"></div>
                      )}
                    </div>
                    <span className="task-text">{task.text}</span>
                    <button 
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        )}

        {activeTab === 'habits' && (
          <section className="habits-section">
            <form onSubmit={addHabit} className="habit-form">
              <div className="input-container">
                <input
                  type="text"
                  value={habitInput}
                  placeholder="What habit are you building?"
                  onChange={(e) => setHabitInput(e.target.value)}
                  className="habit-input"
                />
                <button type="submit" className="add-button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </form>

            <ul className="habit-list">
              {habits.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16ZM12 6C10.3431 6 9 7.34315 9 9C9 9.55228 9.44772 10 10 10C10.5523 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12V13C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13V9C15 7.34315 13.6569 6 12 6Z" fill="#6366f1"/>
                  </svg>
                  <p>No habits yet. Start building one!</p>
                </div>
              ) : (
                habits.map(habit => (
                  <li key={habit.id} className="habit-item">
                    <div 
                      className={`habit-checkbox ${habit.lastCompleted === today ? 'checked' : ''}`}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      {habit.lastCompleted === today ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : null}
                    </div>
                    <div className="habit-info">
                      <span className="habit-name">{habit.name}</span>
                      <div className="streak-display">
                        <span className="streak-count">{habit.streak}</span>
                        <span className="streak-label">day streak</span>
                        <div className="streak-fire">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="#f59e0b"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHabit(habit.id);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default Planner;