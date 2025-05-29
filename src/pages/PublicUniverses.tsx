
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UniverseCard } from '@/components/universes/UniverseCard';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthProvider';

interface Universe {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const PublicUniverses: React.FC = () => {
  const { user } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPublicUniverses();
  }, [user]);

  const fetchPublicUniverses = async () => {
    try {
      let query = supabase
        .from('universes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      // If user is logged in, only show their public universes
      if (user) {
        query = query.eq('creator_id', user.id);
      } else {
        // If no user is logged in, don't show any universes
        setUniverses([]);
        setLoading(false);
        return;
      }

      const { data, error } = await query;

      if (error) throw error;
      setUniverses(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load public universes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUniverseSelect = (universeId: string) => {
    navigate(`/universe/${universeId}`);
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your public universes.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading universes...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Public Universes</h1>
        <p className="text-gray-600">Your public TV show universes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universes.map((universe) => (
          <UniverseCard key={universe.id} universe={universe} onSelect={handleUniverseSelect} />
        ))}
      </div>

      {universes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          You haven't created any public universes yet.
        </div>
      )}
    </div>
  );
};
