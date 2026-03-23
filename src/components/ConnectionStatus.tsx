import React, { useState, useEffect } from 'react';
import { Server, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { apiService } from '../services/api';

export const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const response = await apiService.healthCheck();
      setIsConnected(response.success);
      setLastCheck(new Date());
    } catch (error) {
      setIsConnected(false);
      setLastCheck(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Verificar conexión al cargar
    checkConnection();
    
    // Verificar cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (isChecking) return 'text-yellow-600';
    return isConnected ? 'text-green-600' : 'text-red-600';
  };

  const getStatusText = () => {
    if (isChecking) return 'Verificando...';
    return isConnected ? 'Conectado' : 'Desconectado';
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    return isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Server className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">Estado del Backend</h3>
            <p className="text-xs text-gray-500">
              FastAPI Server (localhost:8000)
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
          
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Verificar conexión"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {!isConnected && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Backend no disponible:</strong> Para conectar con el backend FastAPI, 
            sigue las instrucciones del README para ejecutarlo localmente en el puerto 8000.
          </p>
        </div>
      )}
      
      {lastCheck && (
        <div className="mt-2 text-xs text-gray-500">
          Última verificación: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};