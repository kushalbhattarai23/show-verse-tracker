
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UniverseCard } from '@/components/universes/UniverseCard';
import { ShowCard } from '@/components/shows/ShowCard';
import { EpisodeList } from '@/components/episodes/EpisodeList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Universe {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface Show {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  created_at: string;
}

export const UniversePage: React.FC = () => {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUniverses();
  }, []);

  const fetchUniverses = async () => {
    try {
      const { data, error } = await supabase
        .from('universes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUniverses(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load universes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async (universeId: string) => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .eq('universe_id', universeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShows(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load shows",
        variant: "destructive",
      });
    }
  };

  const handleUniverseSelect = async (universeId: string) => {
    const universe = universes.find(u => u.id === universeId);
    if (universe) {
      setSelectedUniverse(universe);
      await fetchShows(universeId);
    }
  };

  const handleShowSelect = (showId: string) => {
    const show = shows.find(s => s.id === showId);
    if (show) {
      setSelectedShow(show);
    }
  };

  const handleBack = () => {
    if (selectedShow) {
      setSelectedShow(null);
    } else if (selectedUniverse) {
      setSelectedUniverse(null);
      setShows([]);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Show episode list
  if (selectedShow) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {selectedUniverse?.name}
        </Button>
        <EpisodeList showId={selectedShow.id} showTitle={selectedShow.title} />
      </div>
    );
  }

  // Show shows in universe
  if (selectedUniverse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Universes
          </Button>
          <h1 className="text-3xl font-bold">{selectedUniverse.name}</h1>
        </div>
        
        {selectedUniverse.description && (
          <p className="text-gray-600">{selectedUniverse.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} onSelect={handleShowSelect} />
          ))}
        </div>

        {shows.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No shows found in this universe.
          </div>
        )}
      </div>
    );
  }

  // Show universes
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">TV Show Universes</h1>
      <p className="text-gray-600">
        Explore different universes and track your favorite shows and episodes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universes.map((universe) => (
          <UniverseCard key={universe.id} universe={universe} onSelect={handleUniverseSelect} />
        ))}
      </div>

      {universes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No universes found.
        </div>
      )}
    </div>
  );
};
