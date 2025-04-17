import React, { useEffect, useState } from "react";
import journalDB from "../db/journalDB";
import "./Journal.css";
import { FiSave, FiTrash2, FiWifi, FiWifiOff, FiRefreshCw } from "react-icons/fi";

const Journal = () => {
  const [content, setContent] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      attemptSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load notes and check for pending sync
  useEffect(() => {
    const loadData = async () => {
      try {
        const allNotes = await journalDB.notes.orderBy('timestamp').reverse().toArray();
        setSavedNotes(allNotes);
        
        if (isOnline) {
          attemptSync();
        }
      } catch (error) {
        console.error("Failed to load notes:", error);
      }
    };
    loadData();
  }, [isOnline]);

  const attemptSync = async () => {
    setSyncStatus("Syncing...");
    // Simulate sync with server
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSyncStatus("All changes synced");
    setTimeout(() => setSyncStatus(""), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (content.trim() === "") return;
    
    setIsSaving(true);
    try {
      await journalDB.notes.add({
        content,
        timestamp: new Date().toISOString(),
        synced: isOnline
      });

      setContent("");
      const updated = await journalDB.notes.orderBy('timestamp').reverse().toArray();
      setSavedNotes(updated);

      if (isOnline) {
        attemptSync();
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      // Fallback to localStorage
      const fallbackNotes = JSON.parse(localStorage.getItem('journal_fallback') || '[]');
      const newNote = {
        id: Date.now(),
        content,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('journal_fallback', JSON.stringify([...fallbackNotes, newNote]));
      setSavedNotes(prev => [newNote, ...prev]);
      setContent("");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await journalDB.notes.delete(id);
      const updated = await journalDB.notes.orderBy('timestamp').reverse().toArray();
      setSavedNotes(updated);
    } catch (error) {
      console.error('Failed to delete note:', error);
      // Fallback to localStorage
      const fallbackNotes = JSON.parse(localStorage.getItem('journal_fallback') || []);
      const updated = fallbackNotes.filter(note => note.id !== id);
      localStorage.setItem('journal_fallback', JSON.stringify(updated));
      setSavedNotes(updated);
    }
  };

  return (
    <div className="journal-app">
      <header className="journal-header">
        <h1>Travel Journal</h1>
        <p className="subtitle">Capture your memories and experiences</p>
      </header>

      <div className={`status-bar ${isOnline ? 'online' : 'offline'}`}>
        <div className="status-content">
          {isOnline ? (
            <FiWifi className="status-icon" />
          ) : (
            <FiWifiOff className="status-icon" />
          )}
          <span>
            {isOnline ? (
              syncStatus ? (
                <>
                  <FiRefreshCw className="spin" /> {syncStatus}
                </>
              ) : (
                "Online - Changes will sync automatically"
              )
            ) : (
              "Offline - Working locally (changes will sync when back online)"
            )}
          </span>
        </div>
      </div>

      <form onSubmit={handleSave} className="editor-container">
        <div className="editor-wrapper">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write about your day, places you visited, or memorable experiences..."
            className="editor"
            rows={8}
          />
          <div className="editor-footer">
            <div className="word-count">{content.length} characters</div>
            <button 
              type="submit" 
              className="save-btn"
              disabled={isSaving || content.trim() === ""}
            >
              <FiSave className="btn-icon" />
              {isSaving ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </div>
      </form>

      <div className="notes-section">
        <h2 className="section-title">
          <span className="title-icon">📒</span>
          Your Journal Entries
        </h2>
        
        {savedNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✏️</div>
            <p>No entries yet. Start documenting your journey!</p>
          </div>
        ) : (
          <div className="notes-grid">
            {savedNotes.map((note) => (
              <div className="note-card" key={note.id || note.timestamp}>
                <div className="note-content">{note.content}</div>
                <div className="note-footer">
                  <div className="note-meta">
                    <span className="timestamp">
                      {new Date(note.timestamp).toLocaleString()}
                    </span>
                    {!note.synced && (
                      <span className="sync-badge">
                        <FiWifiOff size={12} /> Local
                      </span>
                    )}
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(note.id)}
                    aria-label="Delete entry"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;