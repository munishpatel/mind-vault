import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";
import journalImage from "../assets/journal.avif";
import checklistImage from "../assets/checklist.avif";
import plannerImage from "../assets/planner.avif";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="homepage-header">
        <div className="logo-container">
          <h1>MindVault</h1>
          <div className="logo-accent"></div>
        </div>
        <p className="tagline">Your Offline Personal Knowledge Base</p>
        <div className="header-decoration">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="decoration-circle" style={{ animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>
      </header>

      <main className="homepage-grid">
        <Link to="/journal" className="card">
          <div className="card-image" style={{ backgroundImage: `url(${journalImage})` }}>
            <div className="image-overlay"></div>
          </div>
          <div className="card-content">
            <h2>Trip Journal</h2>
            <p>Write rich-text notes and reflections. Works fully offline.</p>
            <span className="card-cta">
              Start Writing
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </Link>
        <Link to="/checklist" className="card">
          <div className="card-image" style={{ backgroundImage: `url(${checklistImage})` }}>
            <div className="image-overlay"></div>
          </div>
          <div className="card-content">
            <h2>Packing Checklist</h2>
            <p>Organize your travel items with customizable categories.</p>
            <span className="card-cta">
              Get Organized
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </Link>
        <Link to="/planner" className="card">
          <div className="card-image" style={{ backgroundImage: `url(${plannerImage})` }}>
            <div className="image-overlay"></div>
          </div>
          <div className="card-content">
            <h2>Daily Planner</h2>
            <p>Track tasks and habits with offline progress tracking.</p>
            <span className="card-cta">
              Plan Your Day
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </Link>
      </main>

      <footer className="homepage-footer">
        <p>&copy; 2025 MindVault | Built for the offline world</p>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;