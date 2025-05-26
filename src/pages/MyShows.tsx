
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

export const MyShows: React.FC = () => {
  const { user } = useAuth();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMyShows();
    }
  }, [user]);

  const fetchMyShows = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .eq('is_public', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShows(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your shows",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (showId: string) => {
    navigate(`/show/${showId}`);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your private shows.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading your shows...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Shows</h1>
          <p className="text-gray-600">Manage your private shows</p>
        </div>
        <Button onClick={() => navigate('/admin')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Show
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} onSelect={handleShowSelect} />
        ))}
      </div>

      {shows.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't created any private shows yet.</p>
          <Button onClick={() => navigate('/admin')} className="mt-4">
            Create Your First Show
          </Button>
        </div>
      )}
    </div>
  );
};
