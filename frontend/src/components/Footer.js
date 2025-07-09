import React from 'react';
import { Heart, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y Descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Axis Peregrinaciones</h3>
            </div>
            <p className="text-blue-100 text-sm">
              Acompañando peregrinos en su camino espiritual hacia los lugares más sagrados del mundo. 
              Tu compañero virtual de peregrinación para experiencias transformadoras que nutren el alma.
            </p>
          </div>

          {/* Destinos */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Destinos Sagrados</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Tierra Santa - Jerusalén</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Fátima - Portugal</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Santiago de Compostela</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Roma - Ciudad Eterna</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-2 text-sm text-blue-100">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+34 XXX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>info@axisperegrinaciones.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Madrid, España</span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-blue-500 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-blue-100">
              © 2025 Axis Peregrinaciones. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-4 text-xs text-blue-200">
              <span>Operador turístico especializado en peregrinaciones</span>
              <span>•</span>
              <span>Licencia XXXXX</span>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-xs text-blue-200 italic">
              "Caminar en fe, crecer en espíritu, encontrar la paz interior"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;