import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockUser, mockAdmin } from '../mock';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e, userType) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (userType === 'pilgrim') {
        onLogin(mockUser);
      } else {
        onLogin(mockAdmin);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="absolute inset-0 bg-black/20" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1665338033511-e9b19abbce8a')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Sacred Journey</CardTitle>
          <CardDescription className="text-gray-600">
            Your pilgrimage companion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pilgrim" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pilgrim">Pilgrim</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pilgrim" className="space-y-4">
              <form onSubmit={(e) => handleLogin(e, 'pilgrim')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="pilgrim@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in as Pilgrim'}
                </Button>
              </form>
              <div className="text-xs text-gray-500 text-center">
                Demo credentials: pilgrim@email.com / password
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@pilgrimageapp.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in as Admin'}
                </Button>
              </form>
              <div className="text-xs text-gray-500 text-center">
                Demo credentials: admin@pilgrimageapp.com / password
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;