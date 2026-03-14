'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@/lib/supabase-client'
import { 
    Upload, Search, Copy, Check, Grid, List, 
    Image as ImageIcon, Filter, ChevronRight, 
    ExternalLink, Calendar, MapPin 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function MediaExplorer() {
    const [view, setView] = useState<'library' | 'trips'>('library')
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [files, setFiles] = useState<any[]>([])
    const [tripsWithMedia, setTripsWithMedia] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
    const [supabase, setSupabase] = useState<any>(null)

    useEffect(() => {
        const client = createClientComponentClient()
        setSupabase(client)
        if (view === 'library') {
            fetchLibraryFiles(client)
        } else {
            fetchTripMedia(client)
        }
    }, [view])

    const fetchLibraryFiles = async (client: any) => {
        setLoading(true)
        try {
            const { data, error } = await client.storage
                .from('images')
                .list('trips', {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' },
                })

            if (data) {
                const filesWithUrls = data.map((f: any) => ({
                    ...f,
                    url: client.storage.from('images').getPublicUrl(`trips/${f.name}`).data.publicUrl
                }))
                setFiles(filesWithUrls)
            }
        } catch (err) {
            console.error('Error fetching library:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchTripMedia = async (client: any) => {
        setLoading(true)
        try {
            const { data, error } = await client
                .from('trips')
                .select('id, name, image_url, itinerary')
                .order('created_at', { ascending: false })

            if (data) {
                setTripsWithMedia(data)
            }
        } catch (err) {
            console.error('Error fetching trip media:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (file: File) => {
        if (!supabase || !file) return
        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `trips/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file)

            if (uploadError) throw uploadError
            
            // Refresh library if on library view
            if (view === 'library') fetchLibraryFiles(supabase)
            alert('Upload successful!')
        } catch (error: any) {
            console.error('Upload error:', error)
            alert(`Upload failed: ${error.message}`)
        } finally {
            setUploading(false)
        }
    }

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url)
        setCopiedUrl(url)
        setTimeout(() => setCopiedUrl(null), 2000)
    }

    const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex gap-2 p-1 bg-background/50 border border-muted-foreground/10 rounded-xl overflow-hidden">
                    <button 
                        onClick={() => setView('library')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'library' ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <ImageIcon className="h-3.5 w-3.5 inline mr-2" />
                        Library
                    </button>
                    <button 
                        onClick={() => setView('trips')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${view === 'trips' ? 'bg-primary text-background' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Calendar className="h-3.5 w-3.5 inline mr-2" />
                        Trip Media
                    </button>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search assets..."
                            className="w-full pl-9 pr-4 py-2 bg-background border border-muted-foreground/20 rounded-xl text-xs focus:border-primary outline-none"
                        />
                    </div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl cursor-pointer hover:bg-primary/20 transition-all text-xs font-bold uppercase tracking-widest shrink-0">
                        <Upload className="h-3.5 w-3.5" />
                        {uploading ? 'Processing...' : 'Upload'}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleUpload(file)
                        }} />
                    </label>
                </div>
            </div>

            {/* Content Container */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-32 text-muted-foreground"
                        >
                            <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                            <p className="text-xs uppercase tracking-[0.4em]">Querying Storage...</p>
                        </motion.div>
                    ) : view === 'library' ? (
                        <motion.div 
                            key="library"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        >
                            {filteredFiles.map((file) => (
                                <MediaCard 
                                    key={file.name} 
                                    url={file.url} 
                                    name={file.name} 
                                    onCopy={() => copyToClipboard(file.url)}
                                    isCopied={copiedUrl === file.url}
                                />
                            ))}
                            {filteredFiles.length === 0 && (
                                <div className="col-span-full py-32 text-center text-muted-foreground font-serif italic">
                                    No assets found in target directory.
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="trips"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            {tripsWithMedia.map((trip) => (
                                <div key={trip.id} className="space-y-6 bg-card border border-muted-foreground/10 p-6 rounded-2xl overflow-hidden relative">
                                    <div className="noise-overlay opacity-[0.03]" />
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-muted-foreground/10 shrink-0">
                                            <img src={trip.image_url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-lg text-foreground">{trip.name}</h3>
                                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Expedition Media Assets</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                                        {/* Main Hero Asset */}
                                        <div className="space-y-3">
                                            <span className="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-bold">Hero Asset</span>
                                            <MediaCard 
                                                url={trip.image_url} 
                                                name="Hero Image" 
                                                onCopy={() => trip.image_url && copyToClipboard(trip.image_url)}
                                                isCopied={copiedUrl === trip.image_url}
                                            />
                                        </div>

                                        {/* Itinerary Assets */}
                                        {trip.itinerary?.map((day: any, i: number) => (
                                            day.image_url && (
                                                <div key={i} className="space-y-3">
                                                    <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold">Day {day.day || i + 1}</span>
                                                    <MediaCard 
                                                        url={day.image_url} 
                                                        name={day.title || `Day ${day.day}`} 
                                                        onCopy={() => copyToClipboard(day.image_url)}
                                                        isCopied={copiedUrl === day.image_url}
                                                    />
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

function MediaCard({ url, name, onCopy, isCopied }: { url: string; name: string; onCopy: () => void; isCopied: boolean }) {
    if (!url) return (
        <div className="aspect-square rounded-xl bg-muted-foreground/5 border border-dashed border-muted-foreground/10 flex items-center justify-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">No Image</p>
        </div>
    )

    return (
        <div className="group relative aspect-square rounded-xl overflow-hidden border border-muted-foreground/10 bg-muted-foreground/5 hover:border-primary/30 transition-all">
            <img src={url} alt={name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <button 
                    onClick={onCopy}
                    className="p-1.5 bg-background/80 backdrop-blur-md rounded-lg text-foreground hover:bg-primary hover:text-background transition-all"
                    title="Copy URL"
                >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1.5 bg-background/80 backdrop-blur-md rounded-lg text-foreground hover:bg-foreground hover:text-background transition-all"
                >
                    <ExternalLink className="h-3.5 w-3.5" />
                </a>
            </div>

            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 pointer-events-none">
                <p className="text-[9px] text-white/60 truncate font-mono bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                    {name}
                </p>
            </div>
        </div>
    )
}
