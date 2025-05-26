
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const [csvData, setCsvData] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvData(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCsvData = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const header = lines[0].split('\t');
    
    if (header.length !== 4 || header[0] !== 'Show' || header[1] !== 'Episode' || header[2] !== 'Title' || header[3] !== 'Air Date') {
      throw new Error('Invalid CSV format. Expected columns: Show, Episode, Title, Air Date');
    }

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i].split('\t');
      if (columns.length === 4) {
        const [showTitle, episodeInfo, episodeTitle, airDate] = columns;
        
        // Parse episode info (assuming format like "S1E1" or "1x1")
        const episodeMatch = episodeInfo.match(/S?(\d+)[xE](\d+)/i);
        if (episodeMatch) {
          const seasonNumber = parseInt(episodeMatch[1]);
          const episodeNumber = parseInt(episodeMatch[2]);
          
          data.push({
            showTitle: showTitle.trim(),
            seasonNumber,
            episodeNumber,
            episodeTitle: episodeTitle.trim(),
            airDate: airDate.trim() || null
          });
        }
      }
    }
    
    return data;
  };

  const handleImport = async () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please provide CSV data",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const parsedData = parseCsvData(csvData);
      
      // Group episodes by show
      const showsMap = new Map();
      parsedData.forEach(episode => {
        if (!showsMap.has(episode.showTitle)) {
          showsMap.set(episode.showTitle, []);
        }
        showsMap.get(episode.showTitle).push(episode);
      });

      let showsCreated = 0;
      let episodesCreated = 0;

      for (const [showTitle, episodes] of showsMap) {
        // Check if show exists, if not create it
        let { data: existingShow, error: showSelectError } = await supabase
          .from('shows')
          .select('id')
          .eq('title', showTitle)
          .maybeSingle();

        if (showSelectError) throw showSelectError;

        let showId;
        if (!existingShow) {
          const { data: newShow, error: showInsertError } = await supabase
            .from('shows')
            .insert({ title: showTitle })
            .select('id')
            .single();

          if (showInsertError) throw showInsertError;
          showId = newShow.id;
          showsCreated++;
        } else {
          showId = existingShow.id;
        }

        // Insert episodes for this show
        const episodesToInsert = episodes.map(episode => ({
          show_id: showId,
          season_number: episode.seasonNumber,
          episode_number: episode.episodeNumber,
          title: episode.episodeTitle,
          air_date: episode.airDate
        }));

        const { error: episodeInsertError } = await supabase
          .from('episodes')
          .upsert(episodesToInsert, {
            onConflict: 'show_id,season_number,episode_number',
            ignoreDuplicates: false
          });

        if (episodeInsertError) throw episodeInsertError;
        episodesCreated += episodes.length;
      }

      toast({
        title: "Success",
        description: `Import completed! Created ${showsCreated} shows and ${episodesCreated} episodes.`,
      });

      setCsvData('');
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import data",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <p className="text-gray-600">Import shows and episodes from CSV files</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>CSV Import</span>
          </CardTitle>
          <CardDescription>
            Import shows and episodes from a CSV file with columns: Show, Episode, Title, Air Date
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Upload CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="csv-data">Or Paste CSV Data</Label>
            <Textarea
              id="csv-data"
              placeholder="Show	Episode	Title	Air Date
Breaking Bad	S1E1	Pilot	2008-01-20
Breaking Bad	S1E2	Cat's in the Bag...	2008-01-27"
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              rows={10}
              className="mt-2 font-mono text-sm"
            />
          </div>

          <div className="text-sm text-gray-500">
            <p><strong>Format requirements:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Tab-separated values (TSV)</li>
              <li>First row must be headers: Show, Episode, Title, Air Date</li>
              <li>Episode format: S1E1 or 1x1</li>
              <li>Air Date format: YYYY-MM-DD (optional)</li>
            </ul>
          </div>

          <Button 
            onClick={handleImport} 
            disabled={uploading || !csvData.trim()}
            className="w-full"
          >
            {uploading ? (
              'Importing...'
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
