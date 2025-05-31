import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

interface Universe {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface UniverseCardProps {
  universe: Universe;
}

export const UniverseCard: React.FC<UniverseCardProps> = ({ universe }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/universe/${universe.id}`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {universe.name}
          <Badge variant="secondary">Universe</Badge>
        </CardTitle>
        {universe.description && (
          <CardDescription>{universe.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Created {new Date(universe.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};
