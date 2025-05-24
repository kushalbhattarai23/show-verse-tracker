
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ShowTracker } from '@/components/shows/ShowTracker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Show {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  created_at: string;
  universe_id: string;
  universes: {
    name: string;
  };
}

export const ShowDetail: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (showId) {
      fetchShow();
    }
  }, [showId]);

  const fetchShow = async () => {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select(`
          *,
          universes!inner(name)
        `)
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
      navigate('/public/shows');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading show...</div>;
  }

  if (!show) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Show not found</p>
        <Button onClick={() => navigate('/public/shows')} className="mt-4">
          Back to Shows
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/public/shows')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shows
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{show.title}</h1>
          <p className="text-gray-600">Universe: {show.universes.name}</p>
        </div>
      </div>

      <ShowTracker show={show} />
    </div>
  );
};
