
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const token = new URLSearchParams(window.location.search).get('token');
  const [emails, setEmails] = useState([]);
  const [form, setForm] = useState({ to: '', subject: '', body: '', type: 'Transactional' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/communications', {
      headers: { Authorization: token }
    }).then(res => setEmails(res.data));
  }, [token]);

  const sendEmail = () => {
    axios.post('http://localhost:5000/api/send', form, {
      headers: { Authorization: token }
    }).then(() => {
      alert('Email sent');
      window.location.reload();
    });
  };

  return (
    <div>
      <h2>Communication Dashboard</h2>
      <h3>Compose Email</h3>
      <input placeholder="To" onChange={e => setForm({...form, to: e.target.value})} />
      <input placeholder="Subject" onChange={e => setForm({...form, subject: e.target.value})} />
      <textarea placeholder="Body" onChange={e => setForm({...form, body: e.target.value})} />
      <select onChange={e => setForm({...form, type: e.target.value})}>
        <option>Transactional</option>
        <option>Marketing</option>
        <option>Onboarding</option>
        <option>Engagement</option>
      </select>
      <button onClick={sendEmail}>Send</button>
      <h3>Communication History</h3>
      <ul>
        {emails.map(email => (
          <li key={email._id}>{email.subject} to {email.to} ({email.type}) — {email.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
