"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, MapPin, Users, Award, Search, Filter } from "lucide-react"

const trainers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    specialties: ["Weight Loss", "Strength Training", "Nutrition"],
    rating: 4.9,
    reviews: 24,
    experience: "5+ years",
    price: 150,
    location: "Los Angeles, CA",
    clients: 12,
    certifications: ["NASM", "Precision Nutrition"],
    bio: "Certified personal trainer specializing in sustainable weight loss and strength building.",
    image: "SM",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    specialties: ["Bodybuilding", "Powerlifting", "Sports Performance"],
    rating: 4.8,
    reviews: 31,
    experience: "8+ years",
    price: 200,
    location: "New York, NY",
    clients: 15,
    certifications: ["NSCA", "CSCS"],
    bio: "Former competitive bodybuilder helping clients achieve their physique goals.",
    image: "MJ",
  },
  {
    id: 3,
    name: "Emily Chen",
    specialties: ["Yoga", "Pilates", "Flexibility"],
    rating: 5.0,
    reviews: 18,
    experience: "4+ years",
    price: 120,
    location: "San Francisco, CA",
    clients: 8,
    certifications: ["RYT-500", "PMA"],
    bio: "Yoga instructor focused on mind-body connection and functional movement.",
    image: "EC",
  },
  {
    id: 4,
    name: "David Rodriguez",
    specialties: ["CrossFit", "HIIT", "Endurance"],
    rating: 4.7,
    reviews: 22,
    experience: "6+ years",
    price: 175,
    location: "Austin, TX",
    clients: 10,
    certifications: ["CF-L2", "ACSM"],
    bio: "CrossFit coach passionate about functional fitness and metabolic conditioning.",
    image: "DR",
  },
]

export default function TrainersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)

  const specialties = [
    "Weight Loss",
    "Muscle Building",
    "Strength Training",
    "Bodybuilding",
    "CrossFit",
    "Yoga",
    "Pilates",
    "Sports Performance",
    "Nutrition",
  ]

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    )
  }

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSpecialties =
      selectedSpecialties.length === 0 || selectedSpecialties.some((s) => trainer.specialties.includes(s))

    const matchesPrice =
      !priceRange ||
      (priceRange === "under-150" && trainer.price < 150) ||
      (priceRange === "150-200" && trainer.price >= 150 && trainer.price <= 200) ||
      (priceRange === "over-200" && trainer.price > 200)

    return matchesSearch && matchesSpecialties && matchesPrice
  })

  const sortedTrainers = [...filteredTrainers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "experience":
        return Number.parseInt(b.experience) - Number.parseInt(a.experience)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Trainer</h1>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search trainers by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Specialties</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {specialties.map((specialty) => (
                        <div key={specialty} className="flex items-center space-x-2">
                          <Checkbox
                            id={specialty}
                            checked={selectedSpecialties.includes(specialty)}
                            onCheckedChange={() => handleSpecialtyToggle(specialty)}
                          />
                          <label htmlFor={specialty} className="text-sm">
                            {specialty}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under-150">Under $150/month</SelectItem>
                        <SelectItem value="150-200">$150 - $200/month</SelectItem>
                        <SelectItem value="over-200">Over $200/month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {sortedTrainers.length} trainer{sortedTrainers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Trainer Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTrainers.map((trainer) => (
            <Card key={trainer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {trainer.image}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{trainer.rating}</span>
                        <span className="text-sm text-gray-600">({trainer.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">${trainer.price}</p>
                    <p className="text-xs text-gray-600">per month</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{trainer.bio}</p>

                <div className="flex flex-wrap gap-1">
                  {trainer.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span>{trainer.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{trainer.clients} clients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{trainer.location}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Certifications:</p>
                  <div className="flex flex-wrap gap-1">
                    {trainer.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    View Profile
                  </Button>
                  <Button className="flex-1">Book Consultation</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedTrainers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-600 mb-4">No trainers found matching your criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedSpecialties([])
                  setPriceRange("")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
