import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        setSession(user, token);
        navigate('/dashboard');
      } catch (e) {
        console.error('Failed to parse user data', e);
        navigate('/auth');
      }
    } else {
      // If we land here without params, something went wrong or user cancelled
      navigate('/auth');
    }
  }, [searchParams, navigate, setSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
