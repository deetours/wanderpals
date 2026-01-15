"use client"

interface Filters {
  region: string
  terrain: string
  duration: string
}

interface TripFiltersProps {
  activeFilters: Filters
  onFilterChange: (filters: Filters) => void
}

const regions = [
  { value: "all", label: "All Regions" },
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
]

const terrains = [
  { value: "all", label: "All Terrain" },
  { value: "mountains", label: "Mountains" },
  { value: "forest", label: "Forest" },
  { value: "coast", label: "Coast" },
  { value: "desert", label: "Desert" },
]

const durations = [
  { value: "all", label: "Any Duration" },
  { value: "short", label: "Short (≤7 days)" },
  { value: "long", label: "Long (8+ days)" },
]

export function TripFilters({ activeFilters, onFilterChange }: TripFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Region Filter */}
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <button
            key={region.value}
            onClick={() => onFilterChange({ ...activeFilters, region: region.value })}
            className={`px-4 py-2 rounded-full text-sm font-sans transition-all duration-300 ${
              activeFilters.region === region.value
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-card/50 text-muted-foreground border border-border hover:border-muted-foreground/50"
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      <div className="hidden md:block w-px h-8 bg-border self-center" />

      {/* Terrain Filter */}
      <div className="flex flex-wrap gap-2">
        {terrains.map((terrain) => (
          <button
            key={terrain.value}
            onClick={() => onFilterChange({ ...activeFilters, terrain: terrain.value })}
            className={`px-4 py-2 rounded-full text-sm font-sans transition-all duration-300 ${
              activeFilters.terrain === terrain.value
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-card/50 text-muted-foreground border border-border hover:border-muted-foreground/50"
            }`}
          >
            {terrain.label}
          </button>
        ))}
      </div>

      <div className="hidden md:block w-px h-8 bg-border self-center" />

      {/* Duration Filter */}
      <div className="flex flex-wrap gap-2">
        {durations.map((duration) => (
          <button
            key={duration.value}
            onClick={() => onFilterChange({ ...activeFilters, duration: duration.value })}
            className={`px-4 py-2 rounded-full text-sm font-sans transition-all duration-300 ${
              activeFilters.duration === duration.value
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-card/50 text-muted-foreground border border-border hover:border-muted-foreground/50"
            }`}
          >
            {duration.label}
          </button>
        ))}
      </div>
    </div>
  )
}
