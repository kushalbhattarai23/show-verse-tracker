
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, CheckCircle, Search } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface Universe {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  is_public: boolean;
  creator_id: string;
}

interface Episode {
  id: string;
  title: string;
  episode_number: number;
  season_number: number;
  air_date: string | null;
  show_id: string;
  show_title: string;
  is_watched?: boolean;
}

export const UniverseDashboard: React.FC = () => {
  const { universeId } = useParams<{ universeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilter, setShowFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (universeId) {
      fetchUniverse();
      fetchEpisodes();
    }
  }, [universeId, user]);

  const fetchUniverse = async () => {
    try {
      const { data, error } = await supabase
        .from('universes')
        .select('*')
        .eq('id', universeId)
        .single();

      if (error) throw error;
      setUniverse(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load universe details",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select(`
          *,
          shows!inner(
            title,
            show_universes!inner(universe_id)
          )
        `)
        .eq('shows.show_universes.universe_id', universeId)
        .order('air_date', { ascending: true });

      if (error) throw error;
      
      let episodesWithShowTitle = (data || []).map(episode => ({
        ...episode,
        show_title: episode.shows.title
      }));

      // If user is logged in, fetch watch status
      if (user) {
        const episodeIds = episodesWithShowTitle.map(ep => ep.id);
        
        if (episodeIds.length > 0) {
          const { data: watchStatus, error: watchError } = await supabase
            .from('user_episode_status')
            .select('episode_id')
            .eq('user_id', user.id)
            .eq('status', 'watched')
            .in('episode_id', episodeIds);

          if (!watchError) {
            const watchedEpisodeIds = new Set(watchStatus?.map(ws => ws.episode_id) || []);
            episodesWithShowTitle = episodesWithShowTitle.map(episode => ({
              ...episode,
              is_watched: watchedEpisodeIds.has(episode.id)
            }));
          }
        }
      }
      
      setEpisodes(episodesWithShowTitle);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load episodes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchStatus = async (episodeId: string, currentlyWatched: boolean) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to track episodes",
        variant: "destructive",
      });
      return;
    }

    setUpdating(episodeId);
    try {
      if (currentlyWatched) {
        const { error } = await supabase
          .from('user_episode_status')
          .delete()
          .eq('user_id', user.id)
          .eq('episode_id', episodeId);

        if (error) throw error;
        
        setEpisodes(prev => prev.map(ep => 
          ep.id === episodeId ? { ...ep, is_watched: false } : ep
        ));
      } else {
        const { error } = await supabase
          .from('user_episode_status')
          .upsert({
            user_id: user.id,
            episode_id: episodeId,
            status: 'watched' as const,
            watched_at: new Date().toISOString()
          });

        if (error) throw error;
        
        setEpisodes(prev => prev.map(ep => 
          ep.id === episodeId ? { ...ep, is_watched: true } : ep
        ));
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update watch status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  // Filter and sort episodes
  const filteredAndSortedEpisodes = episodes
    .filter(episode => {
      const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           episode.show_title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesShow = showFilter === 'all' || episode.show_title === showFilter;
      
      const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'watched' && episode.is_watched) ||
                           (statusFilter === 'unwatched' && !episode.is_watched);
      
      return matchesSearch && matchesShow && matchesStatus;
    })
    .sort((a, b) => {
      // First, sort by watch status (unwatched first)
      if (a.is_watched !== b.is_watched) {
        return a.is_watched ? 1 : -1;
      }
      
      // Then sort by air date
      const dateA = a.air_date ? new Date(a.air_date).getTime() : 0;
      const dateB = b.air_date ? new Date(b.air_date).getTime() : 0;
      
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      
      // Finally sort by season and episode number
      if (a.season_number !== b.season_number) {
        return a.season_number - b.season_number;
      }
      
      return a.episode_number - b.episode_number;
    });

  // Get unique shows for filter
  const uniqueShows = Array.from(new Set(episodes.map(ep => ep.show_title))).sort();

  if (loading) {
    return <div className="text-center py-8">Loading universe dashboard...</div>;
  }

  if (!universe) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Universe not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Back to Universes
        </Button>
      </div>
    );
  }

  const watchedEpisodes = episodes.filter(ep => ep.is_watched).length;
  const totalEpisodes = episodes.length;
  const progressPercentage = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(`/universe/${universeId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Universe
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{universe.name} Dashboard</h1>
          {universe.description && (
            <p className="text-gray-600">{universe.description}</p>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEpisodes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Watched Episodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{watchedEpisodes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Episodes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Episodes</CardTitle>
          <CardDescription>Track your progress through all shows in this universe</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search episodes or shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={showFilter} onValueChange={setShowFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shows</SelectItem>
                {uniqueShows.map(show => (
                  <SelectItem key={show} value={show}>{show}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="watched">Watched</SelectItem>
                <SelectItem value="unwatched">Unwatched</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Show</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Episode</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Air Date</TableHead>
                <TableHead>Status</TableHead>
                {user && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEpisodes.map((episode) => {
                const isWatched = episode.is_watched;
                return (
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
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {isWatched ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Watched</span>
                          </>
                        ) : (
                          <span className="text-gray-500">Unwatched</span>
                        )}
                      </div>
                    </TableCell>
                    {user && (
                      <TableCell>
                        <Button
                          variant={isWatched ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleWatchStatus(episode.id, isWatched)}
                          disabled={updating === episode.id}
                        >
                          {updating === episode.id ? (
                            'Updating...'
                          ) : isWatched ? (
                            'Mark Unwatched'
                          ) : (
                            'Mark Watched'
                          )}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredAndSortedEpisodes.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No episodes found matching your filters.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
