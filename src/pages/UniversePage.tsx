
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UniverseCard } from '@/components/universes/UniverseCard';
import { ShowCard } from '@/components/shows/ShowCard';
import { EpisodeList } from '@/components/episodes/EpisodeList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Plus } from 'lucide-react';
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

interface Episode {
  id: string;
  title: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  show_id: string;
  show_title: string;
}

export const UniversePage: React.FC = () => {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [availableShows, setAvailableShows] = useState<Show[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingShow, setAddingShow] = useState<string | null>(null);
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

  const fetchEpisodes = async (universeId: string) => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select(`
          *,
          shows!inner(
            title,
            universe_id
          )
        `)
        .eq('shows.universe_id', universeId)
        .order('air_date', { ascending: true });

      if (error) throw error;
      
      const episodesWithShowTitle = (data || []).map(episode => ({
        ...episode,
        show_title: episode.shows.title
      }));
      
      setEpisodes(episodesWithShowTitle);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load episodes",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableShows = async (universeId: string) => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .neq('universe_id', universeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAvailableShows(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load available shows",
        variant: "destructive",
      });
    }
  };

  const handleUniverseSelect = async (universeId: string) => {
    const universe = universes.find(u => u.id === universeId);
    if (universe) {
      setSelectedUniverse(universe);
      await Promise.all([
        fetchShows(universeId),
        fetchEpisodes(universeId),
        fetchAvailableShows(universeId)
      ]);
    }
  };

  const handleShowSelect = (showId: string) => {
    const show = shows.find(s => s.id === showId);
    if (show) {
      setSelectedShow(show);
    }
  };

  const handleAddShow = async (showId: string) => {
    if (!selectedUniverse) return;

    setAddingShow(showId);
    try {
      const { error } = await supabase
        .from('shows')
        .update({ universe_id: selectedUniverse.id })
        .eq('id', showId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Show added to universe successfully!",
      });

      // Refresh the shows list
      await Promise.all([
        fetchShows(selectedUniverse.id),
        fetchEpisodes(selectedUniverse.id),
        fetchAvailableShows(selectedUniverse.id)
      ]);
      setSearchTerm('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add show to universe",
        variant: "destructive",
      });
    } finally {
      setAddingShow(null);
    }
  };

  const handleBack = () => {
    if (selectedShow) {
      setSelectedShow(null);
    } else if (selectedUniverse) {
      setSelectedUniverse(null);
      setShows([]);
      setEpisodes([]);
      setAvailableShows([]);
      setSearchTerm('');
    }
  };

  const filteredAvailableShows = availableShows.filter(show =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Episodes Table */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Episodes</h2>
          {episodes.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Show</TableHead>
                    <TableHead>Season</TableHead>
                    <TableHead>Episode</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Air Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {episodes.map((episode) => (
                    <TableRow key={episode.id}>
                      <TableCell className="font-medium">{episode.show_title}</TableCell>
                      <TableCell>S{episode.season_number}</TableCell>
                      <TableCell>E{episode.episode_number}</TableCell>
                      <TableCell>{episode.title}</TableCell>
                      <TableCell>
                        {episode.air_date 
                          ? new Date(episode.air_date).toLocaleDateString()
                          : 'TBA'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No episodes found in this universe.
            </div>
          )}
        </div>

        {/* Shows in Universe */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Shows in Universe</h2>
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

        {/* Add Shows Section */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Add Shows to Universe</h2>
          
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search shows to add..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Available Shows */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableShows.map((show) => (
              <div key={show.id} className="relative">
                <ShowCard show={show} onSelect={() => {}} />
                <Button
                  onClick={() => handleAddShow(show.id)}
                  disabled={addingShow === show.id}
                  className="absolute top-2 right-2"
                  size="sm"
                >
                  {addingShow === show.id ? (
                    'Adding...'
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>

          {searchTerm && filteredAvailableShows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No shows found matching "{searchTerm}".
            </div>
          )}

          {!searchTerm && availableShows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              All shows are already in universes.
            </div>
          )}
        </div>
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
