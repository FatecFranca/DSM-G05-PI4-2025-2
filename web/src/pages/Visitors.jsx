import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Visitors = () => {
  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await api.get('/visitors');
        setVisitors(response.data);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      }
    };

    fetchVisitors();
  }, []);

  return (
    <div>
      <h1>Visitors</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Visit Date</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map(visitor => (
            <tr key={visitor.id}>
              <td>{visitor.name}</td>
              <td>{new Date(visitor.visitDate).toLocaleDateString()}</td>
              <td>{visitor.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Visitors;