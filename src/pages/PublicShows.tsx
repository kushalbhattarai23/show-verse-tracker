
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { ShowCard } from '@/components/shows/ShowCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>([]);
  const [trackedShowIds, setTrackedShowIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPublicShows();
    if (user) {
      fetchTrackedShows();
    }
  }, [user]);

  const fetchPublicShows = async () => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShows(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load public shows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackedShows = async () => {
    if (!user) return;
    
    try {
      const { data: trackingData, error } = await supabase
        .from('user_show_tracking')
        .select('show_id')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const trackedIds = new Set((trackingData || []).map(item => item.show_id));
      setTrackedShowIds(trackedIds);
    } catch (error: any) {
      console.error('Error fetching tracked shows:', error);
    }
  };

  const handleAddShow = async (showId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track shows",
        variant: "destructive",
      });
      return;
    }

    setAdding(showId);
    try {
      const { error } = await supabase
        .from('user_show_tracking')
        .insert({
          user_id: user.id,
          show_id: showId
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Show added to your tracking list!",
      });

      // Update tracked shows
      setTrackedShowIds(prev => new Set([...prev, showId]));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add show to tracking list",
        variant: "destructive",
      });
    } finally {
      setAdding(null);
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
        <h1 className="text-3xl font-bold">Public Shows</h1>
        <p className="text-gray-600">Browse all public TV shows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => (
          <div key={show.id} className="relative">
            <ShowCard show={show} onSelect={handleShowSelect} />
            {user && !trackedShowIds.has(show.id) && (
              <Button
                onClick={() => handleAddShow(show.id)}
                disabled={adding === show.id}
                className="absolute top-2 right-2"
                size="sm"
              >
                {adding === show.id ? (
                  'Adding...'
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Track
                  </>
                )}
              </Button>
            )}
            {user && trackedShowIds.has(show.id) && (
              <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                Tracked
              </div>
            )}
          </div>
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No public shows found.
        </div>
      )}
    </div>
  );
};
