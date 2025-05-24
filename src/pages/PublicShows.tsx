
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ShowCard } from '@/components/shows/ShowCard';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Show {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  created_at: string;
}

export const PublicShows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShows(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load shows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (showId: string) => {
    navigate(`/show/${showId}`);
  };

  if (loading) {
    return <div className="text-center py-8">Loading shows...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">All Shows</h1>
        <p className="text-gray-600">Browse all available TV shows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} onSelect={handleShowSelect} />
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No shows found.
        </div>
      )}
    </div>
  );
};
