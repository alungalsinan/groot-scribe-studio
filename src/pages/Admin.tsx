import { Navigation } from '@/components/ui/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { AuthorAdmin } from '@/components/admin/AuthorAdmin';
import { SuperAdmin } from '@/components/admin/SuperAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { LogIn } from 'lucide-react';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <LogIn className="h-5 w-5" />
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminContent() {
  const { user, logout, isAuthor, isSuperAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isAuthor ? 'Author Panel' : 'Super Admin Panel'}
            </h1>
            <p className="text-muted-foreground">
              Logged in as {user?.name} ({user?.role})
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {isAuthor && <AuthorAdmin />}
        {isSuperAdmin && <SuperAdmin />}
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AuthProvider>
      <AdminWrapper />
    </AuthProvider>
  );
}

function AdminWrapper() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminContent />;
}