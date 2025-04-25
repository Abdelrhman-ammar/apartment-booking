import React from 'react';
import { ChevronLeft, CheckCircle } from 'lucide-react';

interface IconProps {
  className?: string;
}

export const BackIcon: React.FC<IconProps> = ({ className = "h-5 w-5 mr-2 text-current" }) => {
  return <ChevronLeft className={className} />;
};

export const CheckIcon: React.FC<IconProps> = ({ className = "h-5 w-5 mr-2 text-primary" }) => {
  return <CheckCircle className={className} />;
};