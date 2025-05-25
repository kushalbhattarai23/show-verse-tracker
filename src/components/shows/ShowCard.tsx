
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tv } from 'lucide-react';

interface Show {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  created_at: string;
}

interface ShowCardProps {
  show: Show;
  onSelect: (showId: string) => void;
}

export const ShowCard: React.FC<ShowCardProps> = ({ show, onSelect }) => {
  return (
    <Card 
  className="cursor-pointer hover:shadow-lg transition-shadow"
  onClick={() => onSelect(show.id)}
>
  <CardHeader>
    {show.poster_url && (
      <img
        src={show.poster_url}
        alt={show.title}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
    )}
    <CardTitle className="flex items-center justify-between">
      {show.title}
      <Badge variant="outline">
        <Tv className="h-3 w-3 mr-1" />
        Show
      </Badge>
    </CardTitle>
    {show.description && (
      <CardDescription>{show.description}</CardDescription>
    )}
  </CardHeader>
  <CardContent>
    <div className="text-sm text-gray-500">
      Added {new Date(show.created_at).toLocaleDateString()}
    </div>
  </CardContent>
</Card>

  );
};
