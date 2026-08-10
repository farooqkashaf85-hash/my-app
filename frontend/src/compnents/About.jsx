import React from 'react'

const About = () => {
  return (
    <div className="container my-4">
      <h1 className="mb-3">About Notes App</h1>
      <p>
        This is a simple notes application that lets authenticated users create,
        read, update and delete personal notes. It's built as a full-stack
        project with a Node.js + Express backend (MongoDB for persistence) and
        a React frontend.
      </p>

      <h2 className="mt-4">Key Features</h2>
      <ul>
        <li>User authentication with JWT</li>
        <li>Create, view, edit and delete notes</li>
        <li>Notes are scoped to the logged-in user</li>
        <li>Lightweight REST API for integration</li>
      </ul>

      <h2 className="mt-4">How to Use</h2>
      <ol>
        <li>Sign up or log in.</li>
        <li>Create notes from the home page and manage them from your dashboard.</li>
      </ol>

      <p className="text-muted mt-3">Made with care — enjoy taking notes!</p>
    </div>
  )
}

export default About;
