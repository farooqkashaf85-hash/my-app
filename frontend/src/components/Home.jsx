import React from "react";
import { useNavigate } from "react-router-dom";
import Note from "./Note";
import Addnote from "./Addnote";

const Home = (props) => {
  const { showAlert } = props;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <div>
      {!token ? (
        <>
          {/* Hero Section */}
          <div className="hero-section">
            <div className="container-fluid">
              <div className="row align-items-center min-vh-100">
                <div className="col-lg-6 col-md-12 hero-content">
                  <h1 className="hero-title">Welcome to NoteBook</h1>
                  <p className="hero-subtitle">Organize Your Thoughts, Capture Your Ideas</p>
                  <p className="hero-description">
                    A secure and intuitive note-taking application designed to help you capture, 
                    organize, and manage your ideas effortlessly. Perfect for personal use, study, 
                    and professional documentation.
                  </p>
                  <div className="hero-buttons">
                    <button 
                      className="btn btn-primary btn-lg"
                      onClick={() => navigate("/signup")}
                    >
                      Get Started Free
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-lg"
                      onClick={() => navigate("/about")}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12 hero-image">
                  <div className="hero-illustration">
                    <i className="fas fa-sticky-note"></i>
                    <i className="fas fa-check-circle"></i>
                    <i className="fas fa-lightbulb"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="container">
              <div className="section-header text-center mb-5">
                <h2 className="section-title">Why Choose NoteBook?</h2>
                <p className="section-subtitle">Powerful features designed for your productivity</p>
              </div>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-lock"></i>
                    </div>
                    <h5 className="feature-title">Secure & Private</h5>
                    <p className="feature-text">
                      Your notes are protected with JWT authentication. Only you can access your personal notes.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-sync-alt"></i>
                    </div>
                    <h5 className="feature-title">Real-time Updates</h5>
                    <p className="feature-text">
                      Get instant notifications when your notes are updated. Stay in sync across all your devices.
                    </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <h5 className="feature-title">Easy Search</h5>
                    <p className="feature-text">
                      Find your notes in seconds with our powerful search functionality. Never lose an idea again.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Note showAlert={showAlert} />
      )}
        {/* Footer Section */}
      <section className="footer-section text-center py-5">
        <div className="container">
          <p className="footer-text">Made with passion and care for seamless note-taking experience</p>
          <p className="footer-subtext">Start organizing your ideas today with NoteBook</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
