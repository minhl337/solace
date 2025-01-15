"use client"

import { useEffect, useState } from "react"

type Advocate = {
  id: number
  firstName: string
  lastName: string
  city: string
  degree: string
  specialties: string[]
  yearsOfExperience: number
  phoneNumber: number
  createdAt?: string
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([])
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchField, setSearchField] = useState<"city" | "specialty">("city")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch(`/api/advocates`)
      .then((response) => {
        response.json().then((jsonResponse) => {
          const data: Advocate[] = jsonResponse.data || []
          setAdvocates(data)
          setFilteredAdvocates(data)
          setIsLoading(false)
        })
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredAdvocates(advocates)
    } else {
      const filtered = advocates.filter((advocate) => {
        if (searchField === "city") {
          return advocate.city.toLowerCase().includes(term.toLowerCase())
        } else if (searchField === "specialty") {
          return advocate.specialties.some((specialty) =>
            specialty.toLowerCase().includes(term.toLowerCase())
          )
        }
        return false
      })
      setFilteredAdvocates(filtered)
    }
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchField(e.target.value as "city" | "specialty")
    setSearchTerm("")
    setFilteredAdvocates(advocates)
  }

  const resetSearch = () => {
    setSearchTerm("")
    setFilteredAdvocates(advocates)
  }

  return (
    <div className="flex justify-center min-h-screen">
      <div className="max-w-[1000px] w-full p-4 rounded-lg">
        <h1 className="text-center text-xl font-bold mb-4">Solace Advocates</h1>
        <div className="mb-4 flex items-center space-x-4">
          <div className="w-[30%]">
            <select
              value={searchField}
              onChange={handleFieldChange}
              className="border border-gray-400 p-2 w-full"
            >
              <option value="city">City</option>
              <option value="specialty">Specialty</option>
            </select>
          </div>
          <div className="w-[60%]">
            <input
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-black w-full p-2"
              placeholder={`Search by ${searchField}`}
            />
          </div>
          <div className="w-[10%]">
            <button
              className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600"
              onClick={resetSearch}
            >
              Reset
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-8 h-8 animate-spin"></div>
          </div>
        ) : (
          <div>
            <div className="flex font-bold py-2 space-x-2">
              <div className="flex-1 text-center">First Name</div>
              <div className="flex-1 text-center">Last Name</div>
              <div className="flex-1 text-center">City</div>
              <div className="flex-1 text-center">Degree</div>
              <div className="flex-1 text-center max-w-[120px]">
                Specialties
              </div>
              <div className="flex-1 text-center">Experience</div>
              <div className="flex-1 text-center">Number</div>
            </div>
            {filteredAdvocates.map((advocate) => (
              <div
                key={advocate.id}
                className="flex py-2 border-b border-gray-300 space-x-2"
              >
                <div className="flex-1 text-center">{advocate.firstName}</div>
                <div className="flex-1 text-center">{advocate.lastName}</div>
                <div className="flex-1 text-center">{advocate.city}</div>
                <div className="flex-1 text-center">{advocate.degree}</div>
                <div className="flex-1 text-center max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {advocate.specialties.map((specialty, i) => (
                    <div
                      key={`${specialty}${i}`}
                      className="mb-1 overflow-hidden text-left text-ellipsis whitespace-nowrap"
                    >
                      {specialty}
                    </div>
                  ))}
                </div>
                <div className="flex-1 text-center">
                  {advocate.yearsOfExperience}
                </div>
                <div className="flex-1 text-center">{advocate.phoneNumber}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
