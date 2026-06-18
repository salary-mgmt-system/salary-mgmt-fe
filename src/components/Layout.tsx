import type { FC } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar Navigation */}
      <nav style={{ width: '240px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd', padding: '20px' }}>
        <h3>Salary Management</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/">Dashboard</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/employees">Employees</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/insights">Insights</Link>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
