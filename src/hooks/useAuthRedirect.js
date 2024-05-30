import React from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthRedirect = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem('jwt')|| localStorage.getItem('jwt') === 'undefined'){
      navigate('/');
    }
  }, [navigate]);
};

export default useAuthRedirect;