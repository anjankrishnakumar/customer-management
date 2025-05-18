import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  username?: string | null;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, username, onLogout }) => {
  return (
    <div>
      <header style={styles.header}>
        <div style={styles.title}>Customer Management</div>
        {username && (
          <div style={styles.userSection}>
            <span style={styles.username}>{username}</span>
            <button style={styles.logoutButton} onClick={onLogout}>Logout</button>
          </div>
        )}
      </header>
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

const styles = {
  header: {
    background: '#f3f4f6',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #d1d5db',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  username: {
    fontWeight: 'bold',
    color: '#374151',
  },
  logoutButton: {
    padding: '5px 10px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  main: {
    padding: '40px',
    display: 'flex',
    justifyContent: 'center',
  },
};

export default Layout;
