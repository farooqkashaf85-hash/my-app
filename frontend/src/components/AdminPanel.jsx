import React, { useEffect, useState } from "react";

const baseUrl = "https://my-app-1-1xuw.onrender.com";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const usersResponse = await fetch(`${baseUrl}/users/allusers`, {
          headers: { jwttoken: token },
        });
        const usersJson = await usersResponse.json();
        if (usersJson.success) {
          setUsers(usersJson.data || []);
        }

        const notesResponse = await fetch(`${baseUrl}/Notes/admin/allnotes`, {
          headers: { jwttoken: token },
        });
        const notesJson = await notesResponse.json();
        if (notesJson.data) {
          setNotes(notesJson.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h4>Users</h4>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="list-group">
              {users.map((user) => (
                <li key={user._id} className="list-group-item">
                  <strong>{user.name}</strong> ({user.email}) - <span className="text-muted">{user.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h4>Notes</h4>
          {notes.length === 0 ? (
            <p>No notes found.</p>
          ) : (
            <ul className="list-group">
              {notes.map((note) => (
                <li key={note._id} className="list-group-item">
                  <strong>{note.Title}</strong>
                  <div className="text-muted small">By: {note.user?.name || "Unknown"}</div>
                  <div>{note.Content}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
