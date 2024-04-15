import React from 'react';
import { CSSProperties } from 'react';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // This makes the div take the full viewport height
    textAlign: 'center', // This centers the text inside the flex item
    flexDirection: 'column', // This stacks the h1 and p elements vertically
  }
};

export default NotFound;
