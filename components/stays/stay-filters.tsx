"use client"

interface Filters {
  type: string
  roomType: string
  vibe: string
}

interface StayFiltersProps {
  visible: boolean
  filters: Filters
  onChange: (filters: Filters) => void
}

export function StayFilters({ visible, filters, onChange }: StayFiltersProps) {
  const FilterButton = ({
    label,
    value,
    filterKey,
  }: {
    label: string
    value: string
    filterKey: keyof Filters
  }) => (
    <button
      onClick={() => onChange({ ...filters, [filterKey]: value })}
      className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
        filters[filterKey] === value
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div
      className={`overflow-hidden transition-all duration-700 ease-out ${
        visible ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="px-6 py-4 md:px-16 lg:px-24">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FilterButton label="All" value="all" filterKey="type" />
            <FilterButton label="In the mountains" value="mountains" filterKey="type" />
            <FilterButton label="By the sea" value="beaches" filterKey="type" />
            <FilterButton label="In the city" value="cities" filterKey="type" />
          </div>

          <div className="hidden h-4 w-px bg-border md:block" />

          <div className="flex items-center gap-2">
            <FilterButton label="Any" value="all" filterKey="roomType" />
            <FilterButton label="Shared rooms" value="dorm" filterKey="roomType" />
            <FilterButton label="Private rooms" value="private" filterKey="roomType" />
          </div>

          <div className="hidden h-4 w-px bg-border md:block" />

          <div className="flex items-center gap-2">
            <FilterButton label="Any vibe" value="all" filterKey="vibe" />
            <FilterButton label="For conversations" value="social" filterKey="vibe" />
            <FilterButton label="For rest" value="quiet" filterKey="vibe" />
          </div>
        </div>
      </div>
    </div>
  )
}
