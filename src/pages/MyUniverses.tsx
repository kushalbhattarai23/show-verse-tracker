
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { UniverseCard } from '@/components/universes/UniverseCard';
import { CreateUniverseForm } from '@/components/forms/CreateUniverseForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Universe {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const MyUniverses: React.FC = () => {
  const { user } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMyUniverses();
    }
  }, [user]);

  const fetchMyUniverses = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('universes')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUniverses(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load your universes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUniverseSelect = (universeId: string) => {
    navigate(`/universe/${universeId}`);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchMyUniverses();
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your universes.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading your universes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Universes</h1>
          <p className="text-gray-600">Manage your created universes</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Universe
        </Button>
      </div>

      {showForm && (
        <CreateUniverseForm onSuccess={handleFormSuccess} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universes.map((universe) => (
          <UniverseCard key={universe.id} universe={universe} onSelect={handleUniverseSelect} />
        ))}
      </div>

      {universes.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't created any universes yet.</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Create Your First Universe
          </Button>
        </div>
      )}
    </div>
  );
};
