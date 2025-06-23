import React from 'react';
import './ErrorMessage.css';
import { Card, CardContent } from './ui/card.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { AlertCircle, X } from 'lucide-react';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <Card className="bg-red-900/20 backdrop-blur-lg border-red-700/30">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-800/20 rounded-full">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant="destructive"
                className="bg-red-800/20 text-red-300 border-red-700/30">
                Deu Ruim
              </Badge>
            </div>
            <p className="text-gray-300 text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-white hover:bg-gray-700">
          <X className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorMessage;
