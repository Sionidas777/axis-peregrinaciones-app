import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { authAPI, handleAPIError } from '../services/api';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const credentials = { email, password };
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
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Acceso para Peregrinos</h3>
              <p className="text-sm text-gray-600">
                Ingresa con las credenciales proporcionadas por tu organizador
              </p>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu.email@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
              </Button>
            </form>

            <div className="text-center text-sm text-gray-500">
              ¿No tienes credenciales? Contacta a tu organizador de peregrinación.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
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
              
              <div className="mt-4 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                  Para obtener acceso, contacta con tu organizador de peregrinación
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="admin" className="space-y-4">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Correo Electrónico</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@peregrinacion.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Contraseña</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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