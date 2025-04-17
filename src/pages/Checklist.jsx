import React, { useState, useEffect } from "react";
import "./Checklist.css";
import { FiPlus, FiTrash2, FiCheck, FiRefreshCw, FiX } from "react-icons/fi";

const defaultData = {
  "👕 Clothing": [
    "Pyjamas", "Underwear", "Socks", "Tops", "Jeans", "Shorts",
    "Swimsuits", "Workout Clothes", "Casual Shoes", "Flip Flops", "Sunglasses"
  ],
  "📑 Important Documents": [
    "Passport / Visa", "Identification", "Itinerary", "Boarding Passes",
    "Hotel Reservations", "Travel Insurance", "Emergency Contacts"
  ],
  "🧴 Toiletries": [
    "Shampoo", "Conditioner", "Hair Brush", "Soap", "Toothpaste",
    "Toothbrush", "Face Wash", "Razor", "Deodorant", "Makeup Bag", "Feminine Products"
  ],
  "📱 Miscellaneous": [
    "Camera", "Chargers", "Headphones", "Water bottle", "Wallet", "Phone"
  ]
};

const Checklist = () => {
  const [checklist, setChecklist] = useState({});
  const [customItem, setCustomItem] = useState("");
  const [category, setCategory] = useState("👕 Clothing");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize checklist
  useEffect(() => {
    const stored = localStorage.getItem("packingChecklist");
    
    if (stored) {
      setChecklist(JSON.parse(stored));
    } else {
      const structured = {};
      for (let cat in defaultData) {
        structured[cat] = defaultData[cat].map(item => ({ name: item, checked: false }));
      }
      localStorage.setItem("packingChecklist", JSON.stringify(structured));
      setChecklist(structured);
    }
  }, []);

  // Auto-save and calculate progress
  useEffect(() => {
    if (Object.keys(checklist).length > 0) {
      localStorage.setItem("packingChecklist", JSON.stringify(checklist));
      
      // Calculate packing progress
      let total = 0;
      let checked = 0;
      for (let cat in checklist) {
        total += checklist[cat].length;
        checked += checklist[cat].filter(item => item.checked).length;
      }
      setProgress(total > 0 ? Math.round((checked / total) * 100) : 0);
    }
  }, [checklist]);

  const toggleCheck = (cat, index) => {
    const updated = { ...checklist };
    updated[cat][index].checked = !updated[cat][index].checked;
    setChecklist(updated);
  };

  const addCustomItem = (e) => {
    e.preventDefault();
    if (!customItem.trim()) return;
    const updated = { ...checklist };
    if (!updated[category]) updated[category] = [];
    updated[category].push({ name: customItem.trim(), checked: false });
    setChecklist(updated);
    setCustomItem("");
  };

  const addNewCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const updated = { ...checklist };
    updated[newCategory.trim()] = [];
    setChecklist(updated);
    setNewCategory("");
    setShowNewCategory(false);
    setCategory(newCategory.trim());
  };

  const deleteItem = (cat, index) => {
    const updated = { ...checklist };
    updated[cat].splice(index, 1);
    setChecklist(updated);
  };

  const deleteCategory = (cat) => {
    const updated = { ...checklist };
    delete updated[cat];
    setChecklist(updated);
    setCategory(Object.keys(updated)[0] || "");
  };

  const clearAllChecks = () => {
    const updated = {};
    for (let cat in checklist) {
      updated[cat] = checklist[cat].map(item => ({ ...item, checked: false }));
    }
    setChecklist(updated);
  };

  const resetChecklist = () => {
    const fresh = {};
    for (let cat in defaultData) {
      fresh[cat] = defaultData[cat].map(item => ({ name: item, checked: false }));
    }
    setChecklist(fresh);
  };

  return (
    <div className="checklist-app">
      <header className="checklist-header">
        <h1>Packing Checklist</h1>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{progress}% Packed</span>
        </div>
      </header>

      <main className="checklist-main">
        <div className="checklist-grid">
          {Object.entries(checklist).map(([cat, items]) => (
            <div key={cat} className="checklist-category">
              <div className="category-header">
                <h3>{cat}</h3>
                <button 
                  className="delete-category"
                  onClick={() => deleteCategory(cat)}
                  aria-label={`Delete ${cat} category`}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              
              <ul className="item-list">
                {items.map((item, idx) => (
                  <li key={idx} className="item">
                    <label className="item-label">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleCheck(cat, idx)}
                        className="item-checkbox"
                      />
                      <span className={`item-name ${item.checked ? 'checked' : ''}`}>
                        {item.name}
                      </span>
                    </label>
                    <button 
                      className="delete-item"
                      onClick={() => deleteItem(cat, idx)}
                      aria-label={`Delete ${item.name}`}
                    >
                      <FiX size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="checklist-controls">
          <form onSubmit={addCustomItem} className="add-item-form">
            <div className="form-row">
              <input
                type="text"
                value={customItem}
                placeholder="Add custom item..."
                onChange={(e) => setCustomItem(e.target.value)}
                className="item-input"
              />
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="category-select"
              >
                {Object.keys(checklist).map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
              <button type="submit" className="add-button">
                <FiPlus size={18} />
              </button>
            </div>
          </form>

          <div className="category-actions">
            {showNewCategory ? (
              <form onSubmit={addNewCategory} className="add-category-form">
                <input
                  type="text"
                  value={newCategory}
                  placeholder="New category name..."
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="category-input"
                />
                <button type="submit" className="confirm-button">
                  <FiCheck size={18} />
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowNewCategory(false)}
                >
                  <FiX size={18} />
                </button>
              </form>
            ) : (
              <button 
                className="new-category-button"
                onClick={() => setShowNewCategory(true)}
              >
                <FiPlus size={16} /> Add Category
              </button>
            )}
          </div>

          <div className="utility-buttons">
            <button 
              onClick={clearAllChecks}
              className="clear-button"
            >
              <FiRefreshCw size={16} /> Clear Checks
            </button>
            <button 
              onClick={resetChecklist}
              className="reset-button"
            >
              <FiTrash2 size={16} /> Reset All
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checklist;