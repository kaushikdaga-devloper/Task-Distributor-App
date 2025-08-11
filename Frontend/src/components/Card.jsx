import React from 'react';

const Card = ({ title, subtitle, children, maxWidth = '28rem' }) => {
  return (
    <div className="content-card" style={{ maxWidth: maxWidth }}>
      <div className="card-header">
        {/* You can add the lock icon back here if desired */}
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;