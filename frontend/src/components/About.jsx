import React from 'react'

const About = () => {
  return (
    <div className="about-page">
      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col-lg-6">
              <div className="about-content">
                <h2 className="section-title mb-4">About NoteBook</h2>
                <p className="about-paragraph">
                  NoteBook is a modern, full-stack note-taking application built with cutting-edge technologies. 
                  Our mission is to provide users with a seamless, secure, and intuitive platform to capture, 
                  organize, and manage their thoughts and ideas. Whether you're a student, professional, or creative, 
                  NoteBook adapts to your workflow and helps you stay productive and focused. We believe that great 
                  ideas deserve to be preserved, and NoteBook is here to help you do just that.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-illustration">
                <i className="fas fa-book"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-detailed-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Key Features</h2>
            <p className="section-subtitle">Everything you need for productive note-taking</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="feature-detailed-card">
                <div className="feature-number">01</div>
                <h5>Secure Authentication</h5>
                <p>Secure User authentication ensures your notes are private and secure. Only you can access your personal notes with encrypted passwords.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-detailed-card">
                <div className="feature-number">02</div>
                <h5>Full CRUD Operations</h5>
                <p>Create, read, update, and delete your notes with an intuitive interface. Manage all your notes from a centralized dashboard.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-detailed-card">
                <div className="feature-number">03</div>
                <h5>Real-time Notifications</h5>
                <p>Get instant updates when your notes are modified. WebSocket integration keeps you informed of all changes in real-time.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-detailed-card">
                <div className="feature-number">04</div>
                <h5>Advanced Search</h5>
                <p>Powerful search functionality helps you find notes instantly. Filter and organize notes by keywords and categories with ease.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-detailed-card">
                <div className="feature-number">05</div>
                <h5>Pagination</h5>
                <p>Handle large collections of notes efficiently with intelligent pagination. Browse through your notes smoothly and quickly.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="feature-detailed-card">
                <div className="feature-number">06</div>
                <h5>Responsive Design</h5>
                <p>Beautiful, mobile-friendly interface that works perfectly on all devices. Take notes on your phone, tablet, or desktop.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple steps to start organizing your ideas</p>
          </div>
          <div className="row">
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="step-card">
                <div className="step-number">1</div>
                <h5>Sign Up</h5>
                <p>Create your account with a simple registration. Secure your account with a strong password.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="step-card">
                <div className="step-number">2</div>
                <h5>Log In</h5>
                <p>Access your account securely with JWT authentication. Your session is protected and private.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="step-card">
                <div className="step-number">3</div>
                <h5>Create Notes</h5>
                <p>Add new notes with titles and content. Organize your thoughts as you go with an intuitive editor.</p>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-4">
              <div className="step-card">
                <div className="step-number">4</div>
                <h5>Manage & Share</h5>
                <p>Edit, delete, or search your notes anytime. Keep your ideas organized and accessible whenever you need them.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="footer-section text-center py-5">
        <div className="container">
          <p className="footer-text">Made with passion and care for seamless note-taking experience</p>
          <p className="footer-subtext">Start organizing your ideas today with NoteBook</p>
        </div>
      </section>
    </div>
  )
}

export default About;
