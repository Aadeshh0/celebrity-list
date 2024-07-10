import React, { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: string;
  first: string;
  last: string;
  dob: string;  
  gender: string;
  email: string;
  picture: string;
  country: string;
  description: string;
}

const AccordionItem: React.FC<{ user: User, onSave: (user: User) => void, onDelete: (id: string) => void }> = ({ user, onSave, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEditedUser(user); // Reset editedUser to original user data when toggling edit mode
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(editedUser);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(user.id);
    setShowDeleteDialog(false);
  };

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        <img src={user.picture} alt={user.first} />
        <span>{user.first} {user.last}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="accordion-content">
          {!isEditing ? (
            <>
              <div className="accordion-details">
                <div>
                  <span className="accordion-label">Age:</span> {calculateAge(user.dob)} Years
                </div>
                <div>
                  <span className="accordion-label">Gender:</span> {user.gender}
                </div>
                <div>
                  <span className="accordion-label">Country:</span> {user.country}
                </div>
              </div>
              <div className="description">
                <span className="accordion-label">Description:</span>
                <p>{user.description}</p>
              </div>
              <div className="button-group">
                <button className="edit-button" onClick={toggleEdit}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f5f5f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                </button>
                <button className="delete-button" onClick={() => setShowDeleteDialog(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e64c4c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-trash-2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" x2="10" y1="11" y2="17"/>
                    <line x1="14" x2="14" y1="11" y2="17"/>
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <form className="edit-form" onSubmit={handleSave}>
              <input
                type="text"
                value={editedUser.first}
                onChange={(e) => setEditedUser({ ...editedUser, first: e.target.value })}
              />
              <input
                type="email"
                value={editedUser.email}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
              />
              <select
                value={editedUser.gender}
                onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Rather not say">Rather not say</option>
              </select>
              <input
                type="text"
                value={editedUser.country}
                onChange={(e) => setEditedUser({ ...editedUser, country: e.target.value })}
              />
              <textarea
                value={editedUser.description}
                onChange={(e) => setEditedUser({ ...editedUser, description: e.target.value })}
              />
              <div className="button-group">
                <button type="submit">Save</button>
                <button type="button" onClick={toggleEdit}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
      {showDeleteDialog && (
        <div className="delete-dialog">
          <p>Are you sure you want to delete?</p>
          <div className="button-group">
            <button className="cancel-button" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch data from JSON file
    fetch('/public/celebrities.json')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  const handleSave = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const filteredUsers = users.filter(user =>
    user.first.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-list">
      <input
        className="search-bar"
        type="text"
        placeholder="Search user"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredUsers.map(user => (
        <AccordionItem key={user.id} user={user} onSave={handleSave} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default UserList;
