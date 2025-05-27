
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, CheckCircle, Eye } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';

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
}

export const ShowDetail: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [show, setShow] = useState<Show | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (showId) {
      fetchShow();
      fetchEpisodes();
      if (user) {
        fetchWatchStatus();
      }
    }
  }, [showId, user]);

  const fetchShow = async () => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .eq('id', showId)
        .single();

      if (error) throw error;
      setShow(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load show details",
        variant: "destructive",
      });
      navigate('/shows/public');
    }
  };

  const fetchEpisodes = async () => {
    try {
      const { data, error } = await supabase
        .from('episodes')
        .select('*')
        .eq('show_id', showId)
        .order('season_number', { ascending: true })
        .order('episode_number', { ascending: true });

      if (error) throw error;
      setEpisodes(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load episodes",
        variant: "destructive",
      });
    }
  };

  const fetchWatchStatus = async () => {
    if (!user) return;

    try {
      const { data: showEpisodes, error: episodesError } = await supabase
        .from('episodes')
        .select('id')
        .eq('show_id', showId);

      if (episodesError) throw episodesError;

      const episodeIds = showEpisodes?.map(ep => ep.id) || [];

      if (episodeIds.length === 0) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_episode_status')
        .select('episode_id')
        .eq('user_id', user.id)
        .eq('status', 'watched')
        .in('episode_id', episodeIds);

      if (error) throw error;
      setWatchedEpisodes((data || []).map(item => item.episode_id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load watch status",
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
        setWatchedEpisodes(prev => prev.filter(id => id !== episodeId));
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
        setWatchedEpisodes(prev => [...prev, episodeId]);
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
    return <div className="text-center py-8">Loading show...</div>;
  }

  if (!show) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Show not found</p>
        <Button onClick={() => navigate('/shows/public')} className="mt-4">
          Back to Shows
        </Button>
      </div>
    );
  }

  const progressPercentage = episodes.length > 0 ? (watchedEpisodes.length / episodes.length) * 100 : 0;
  const showStatus = 
    watchedEpisodes.length === 0 ? 'not_started' :
    watchedEpisodes.length === episodes.length ? 'completed' :
    'watching';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/shows/public')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shows
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{show.title}</h1>
          {show.description && (
            <p className="text-gray-600">{show.description}</p>
          )}
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>Watch Progress</span>
              <Badge 
                variant={
                  showStatus === 'completed' ? 'default' :
                  showStatus === 'watching' ? 'secondary' :
                  'outline'
                }
              >
                {showStatus === 'completed' ? 'Completed' :
                 showStatus === 'watching' ? 'Watching' :
                 'Not Started'}
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{watchedEpisodes.length} / {episodes.length} episodes watched</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Episodes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Episodes</CardTitle>
          <CardDescription>Track your progress through the series</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Episode</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Air Date</TableHead>
                <TableHead>Status</TableHead>
                {user && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {episodes.map((episode) => {
                const isWatched = watchedEpisodes.includes(episode.id);
                return (
                  <TableRow key={episode.id}>
                    <TableCell className="font-medium">
                      S{episode.season_number}E{episode.episode_number}
                    </TableCell>
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
              No episodes found for this show.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
