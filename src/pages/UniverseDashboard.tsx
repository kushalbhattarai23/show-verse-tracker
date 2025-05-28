
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle } from 'lucide-react';
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
              {episodes.map((episode) => {
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
          {episodes.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No episodes found in this universe.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
