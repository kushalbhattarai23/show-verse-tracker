
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to public universes as the main page
    navigate('/shows/public');
  }, [navigate]);

  return (
    <div className="text-center py-8">
      <p>Redirecting...</p>
    </div>
  );
};

export default Index;
