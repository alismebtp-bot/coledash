import { useState } from 'react'
import { MapPin, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cities } from '@/data/cities'
import { useCity } from '@/context/CityContext'

export default function CitySelector() {
  const { currentCity, setCurrentCity } = useCity()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2 text-sm">
          <MapPin className="h-4 w-4" />
          {currentCity.name}
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select your city</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cities..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-1">
            {filteredCities.map((city) => (
              <Button
                key={city.id}
                variant={currentCity.id === city.id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => {
                  setCurrentCity(city)
                  setOpen(false)
                }}
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="text-left">
                  <div className="font-medium">{city.name}</div>
                  <div className="text-xs text-muted-foreground">{city.country}</div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
