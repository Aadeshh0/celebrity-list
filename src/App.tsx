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

const AccordionItem: React.FC<{ user: User }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);
  const toggleEdit = () => setIsEditing(!isEditing);

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

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Implement delete logic here
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
                <button className="edit-button" onClick={toggleEdit}>Edit</button>
                <button className="delete-button" onClick={() => setShowDeleteDialog(true)}>Delete</button>
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
        <AccordionItem key={user.id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
