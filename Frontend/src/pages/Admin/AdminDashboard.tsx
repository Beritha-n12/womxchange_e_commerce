import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import MainBar from '../../components/MainBar/MainBar';

const AdminDashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <MainBar>
        <h2>Admin Dashboard Main Content</h2>
      </MainBar>
    </div>
  );
};

export default AdminDashboard;
