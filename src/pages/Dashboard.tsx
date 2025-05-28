
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tv, Play, CheckCircle, Clock, TrendingUp, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalShows: number;
  totalEpisodes: number;
  watchedEpisodes: number;
  watchingShows: number;
  notStartedShows: number;
  completedShows: number;
  totalUniverses: number;
}

interface ShowProgress {
  id: string;
  title: string;
  totalEpisodes: number;
  watchedEpisodes: number;
  status: 'watching' | 'not_started' | 'completed';
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [showProgress, setShowProgress] = useState<ShowProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Get tracked shows
      const { data: trackedShows, error: trackedError } = await supabase
        .from('user_show_tracking')
        .select(`
          show_id,
          shows (
            id,
            title
          )
        `)
        .eq('user_id', user.id);

      if (trackedError) throw trackedError;

      const trackedShowIds = (trackedShows || []).map(item => item.show_id);

      if (trackedShowIds.length === 0) {
        setStats({
          totalShows: 0,
          totalEpisodes: 0,
          watchedEpisodes: 0,
          watchingShows: 0,
          notStartedShows: 0,
          completedShows: 0,
          totalUniverses: 0
        });
        setShowProgress([]);
        setLoading(false);
        return;
      }

      // Get episodes for tracked shows
      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .select(`
          id,
          show_id,
          title,
          shows!inner(id, title)
        `)
        .in('show_id', trackedShowIds);

      if (episodeError) throw episodeError;

      // Get watched episodes
      const { data: watchedData, error: watchedError } = await supabase
        .from('user_episode_status')
        .select('episode_id')
        .eq('user_id', user.id)
        .eq('status', 'watched');

      if (watchedError) throw watchedError;

      const watchedEpisodeIds = new Set((watchedData || []).map(item => item.episode_id));

      // Get universes count (you can track universes you're interested in)
      const { data: universesData, error: universesError } = await supabase
        .from('universes')
        .select('id')
        .eq('is_public', true);

      if (universesError) throw universesError;

      // Calculate stats
      const totalEpisodes = episodeData?.length || 0;
      const watchedEpisodes = episodeData?.filter(ep => watchedEpisodeIds.has(ep.id)).length || 0;

      // Group by shows
      const showsMap = new Map();
      episodeData?.forEach(episode => {
        const showId = episode.show_id;
        if (!showsMap.has(showId)) {
          showsMap.set(showId, {
            id: showId,
            title: episode.shows.title,
            totalEpisodes: 0,
            watchedEpisodes: 0
          });
        }
        const show = showsMap.get(showId);
        show.totalEpisodes++;
        if (watchedEpisodeIds.has(episode.id)) {
          show.watchedEpisodes++;
        }
      });

      const shows = Array.from(showsMap.values());
      const totalShows = shows.length;
      const watchingShows = shows.filter(show => show.watchedEpisodes > 0 && show.watchedEpisodes < show.totalEpisodes).length;
      const completedShows = shows.filter(show => show.watchedEpisodes === show.totalEpisodes && show.totalEpisodes > 0).length;
      const notStartedShows = shows.filter(show => show.watchedEpisodes === 0).length;

      setStats({
        totalShows,
        totalEpisodes,
        watchedEpisodes,
        watchingShows,
        notStartedShows,
        completedShows,
        totalUniverses: universesData?.length || 0
      });

      // Set show progress with status
      const progressWithStatus = shows.map(show => ({
        ...show,
        status: show.watchedEpisodes === 0 ? 'not_started' as const :
                show.watchedEpisodes === show.totalEpisodes ? 'completed' as const :
                'watching' as const
      }));

      setShowProgress(progressWithStatus);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  const completionPercentage = stats?.totalEpisodes ? Math.round((stats.watchedEpisodes / stats.totalEpisodes) * 100) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tracked Shows</CardTitle>
            <Tv className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalShows || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Episodes</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalEpisodes || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watched Episodes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.watchedEpisodes || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Universes</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUniverses || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {stats?.watchedEpisodes || 0} of {stats?.totalEpisodes || 0} episodes watched
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {completionPercentage}% complete - {((stats?.totalEpisodes || 0) - (stats?.watchedEpisodes || 0))} episodes left
          </p>
        </CardContent>
      </Card>

      {/* Show Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-blue-600" />
              <span>Watching</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats?.watchingShows || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span>Not Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats?.notStartedShows || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Completed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats?.completedShows || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Show Progress List */}
      <Card>
        <CardHeader>
          <CardTitle>Show Progress</CardTitle>
          <CardDescription>Track your progress across all shows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {showProgress.map((show) => (
              <div key={show.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{show.title}</h3>
                  <p className="text-sm text-gray-600">
                    {show.watchedEpisodes} / {show.totalEpisodes} episodes
                  </p>
                  <Progress 
                    value={show.totalEpisodes > 0 ? (show.watchedEpisodes / show.totalEpisodes) * 100 : 0} 
                    className="w-full mt-2" 
                  />
                </div>
                <div className="ml-4">
                  <Badge 
                    variant={
                      show.status === 'completed' ? 'default' :
                      show.status === 'watching' ? 'secondary' :
                      'outline'
                    }
                  >
                    {show.status === 'completed' ? 'Completed' :
                     show.status === 'watching' ? 'Watching' :
                     'Not Started'}
                  </Badge>
                </div>
              </div>
            ))}
            {showProgress.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No tracked shows found. Start tracking some shows to see your progress!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
