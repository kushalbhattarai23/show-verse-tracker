'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/integrations/supabase/client'
import { UniverseCard } from '@/components/universes/UniverseCard'
import { ShowCard } from '@/components/shows/ShowCard'
import { EpisodeList } from '@/components/episodes/EpisodeList'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Universe {
  id: string
  name: string
  description: string | null
  created_at: string
  is_public: boolean
  creator_id: string
}

interface Show {
  id: string
  title: string
  description: string | null
  poster_url: string | null
  created_at: string
}

interface Episode {
  id: string
  title: string
  episode_number: number
  season_number: number
  air_date: string | null
  show_id: string
  show_title: string
  is_watched?: boolean
}

export default function UniverseTestPage() {
  const router = useRouter()
  const { id } = router.query
  const { toast } = useToast()

  const [universe, setUniverse] = useState<Universe | null>(null)
  const [shows, setShows] = useState<Show[]>([])
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchUniverseData = async () => {
      setLoading(true)

      // 1. Get the Universe
      const { data: universeData, error: universeError } = await supabase
        .from('universes')
        .select('*')
        .eq('id', id)
        .single()

      if (universeError) {
        toast({ title: 'Error', description: universeError.message })
        return
      }

      setUniverse(universeData)

      // 2. Get Shows related to this universe
      const { data: showData, error: showError } = await supabase
        .from('shows')
        .select('*')
        .eq('universe_id', id)

      if (showError) {
        toast({ title: 'Error', description: showError.message })
        return
      }

      setShows(showData)

      // 3. Get Episodes from those shows
      const showIds = showData.map((show) => show.id)
      const { data: episodeData, error: episodeError } = await supabase
        .from('episodes')
        .select('*')
        .in('show_id', showIds)

      if (episodeError) {
        toast({ title: 'Error', description: episodeError.message })
      } else {
        setEpisodes(episodeData)
      }

      setLoading(false)
    }

    fetchUniverseData()
  }, [id])

  if (loading) return <p className="p-4">Loading...</p>
  if (!universe) return <p className="p-4">Universe not found</p>

  return (
    <DIV> Universe Test Page</DIV>
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <Link href="/universes">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold">{universe.name}</h1>
      </div>

      <UniverseCard universe={universe} />

      <h2 className="text-xl font-semibold">Shows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </div>

      <h2 className="text-xl font-semibold">Episodes</h2>
      <EpisodeList episodes={episodes} />
    </div>
  )
}
