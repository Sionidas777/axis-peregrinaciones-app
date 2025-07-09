import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { authAPI, handleAPIError } from '../services/api';

const Login = ({ onLogin }) => {
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerGroupId, setRegisterGroupId] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('login-peregrino');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const credentials = { email: loginEmail, password: loginPassword };
      const response = await authAPI.login(credentials);
      
      // Get user data from response
      const userData = response.user;
      
      // Call onLogin with user data
      onLogin(userData);
      
    } catch (error) {
      console.error('Login error:', error);
      setError(handleAPIError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const userData = {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: 'pilgrim',
        group_id: registerGroupId || 'group_001' // Default group if none specified
      };
      
      const response = await authAPI.register(userData);
      
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.');
      
      // Clear form
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterGroupId('');
      
      // Switch to login tab
      setTimeout(() => {
        setActiveTab('login-peregrino');
        setLoginEmail(registerEmail);
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Register error:', error);
      setError(handleAPIError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (userType) => {
    if (userType === 'admin') {
      setLoginEmail('admin@pilgrimageapp.com');
      setLoginPassword('admin123');
      setActiveTab('login-admin');
    } else {
      setLoginEmail('maria@email.com');
      setLoginPassword('password');
      setActiveTab('login-peregrino');
    }
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
          <CardTitle className="text-3xl font-bold text-gray-800">Axis Peregrinaciones</CardTitle>
          <CardDescription className="text-gray-600">
            Tu compañero virtual de peregrinación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login-peregrino">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login-peregrino" className="space-y-4">
              <div className="space-y-4">
                <Tabs value={activeTab.startsWith('login-') ? activeTab : 'login-peregrino'} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login-peregrino">Peregrino</TabsTrigger>
                    <TabsTrigger value="login-admin">Admin</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login-peregrino" className="space-y-4 mt-4">
                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Correo Electrónico</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="peregrino@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Contraseña</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Ingresa tu contraseña"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión como Peregrino'}
                      </Button>
                    </form>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        onClick={() => fillDemoCredentials('peregrino')}
                        className="w-full text-xs"
                        disabled={isLoading}
                      >
                        Usar credenciales demo de peregrino
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        Credenciales demo: maria@email.com / password
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="login-admin" className="space-y-4 mt-4">
                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-700">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-login-email">Correo Electrónico</Label>
                        <Input
                          id="admin-login-email"
                          type="email"
                          placeholder="admin@peregrinacion.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="admin-login-password">Contraseña</Label>
                        <Input
                          id="admin-login-password"
                          type="password"
                          placeholder="Ingresa tu contraseña"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-red-600 hover:bg-red-700 transition-colors"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión como Administrador'}
                      </Button>
                    </form>
                    
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        onClick={() => fillDemoCredentials('admin')}
                        className="w-full text-xs"
                        disabled={isLoading}
                      >
                        Usar credenciales demo de admin
                      </Button>
                      <div className="text-xs text-gray-500 text-center">
                        Credenciales demo: admin@pilgrimageapp.com / admin123
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Nombre Completo</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">Correo Electrónico</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Crea una contraseña segura"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength="6"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-group">ID del Grupo (Opcional)</Label>
                  <Input
                    id="register-group"
                    type="text"
                    placeholder="group_001 (dejar vacío para grupo por defecto)"
                    value={registerGroupId}
                    onChange={(e) => setRegisterGroupId(e.target.value)}
                  />
                  <div className="text-xs text-gray-500">
                    Si no especificas un grupo, serás asignado al grupo por defecto.
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registrando...' : 'Registrarse como Peregrino'}
                </Button>
              </form>
              
              <div className="text-xs text-gray-500 text-center">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={() => setActiveTab('login-peregrino')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Inicia sesión aquí
                </button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              © 2025 Axis Peregrinaciones - Tu compañero virtual de peregrinación
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;