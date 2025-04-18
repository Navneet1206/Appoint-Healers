import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  
  // Track filtered doctors
  const [filterDoc, setFilterDoc] = useState([])
  // Toggle for showing/hiding the filter panel on mobile
  const [showFilter, setShowFilter] = useState(false)
  
  const navigate = useNavigate()

  // Add a simple loading check: If doctors is undefined or still empty 
  // and you know you fetch them asynchronously, you can show a "Loading" state.
  // (Adjust this logic as needed depending on how you load your data.)
  const [isLoading, setIsLoading] = useState(true)

  const applyFilter = () => {
    // If "speciality" is set and not "All", filter; otherwise show all
    if (speciality && speciality !== "All") {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(() => {
    // Only apply filter if doctors array has length
    if (doctors && doctors.length > 0) {
      applyFilter()
      setIsLoading(false)
    } else {
      // If you do not fetch doctors from an API, remove this logic.
      // If you do fetch them, isLoading can remain true until they arrive.
      setFilterDoc([])
    }
  }, [doctors, speciality])

  // Debug logs to see exactly what's happening
  console.log("SPECIALITY from URL param:", speciality)
  console.log("ALL professionalS from context:", doctors)
  console.log("FILTERED professionalS:", filterDoc)

  // All available filter options (including "All")
  const filterSpecialities = [
    "All",
    "Counseling professional",
    "Relational therapist",
    "Listeners"
  ]

  // Framer-motion variants for filter items
  const filterItemVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  // Framer-motion variant for the doctor cards
  const cardVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  }

  // If you're still fetching doctors, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <p className="text-gray-600 text-lg">Loading professionals...</p>
      </div>
    )
  }

  return (
    <div className="bg-[#f8f9f5] mt-28 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.p 
          className="text-gray-600 text-lg mb-4" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
        >
          Browse through our expert professionals by specialty.
        </motion.p>
        
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
          <button 
            onClick={() => setShowFilter(!showFilter)} 
            className={`py-1 px-4 border rounded text-sm sm:hidden transition-all ${
              showFilter ? 'bg-rose-600 text-white' : 'bg-white text-rose-600'
            }`}
          >
            Filters
          </button>
          
          <motion.div 
            className={`flex flex-col sm:flex-row gap-4 text-sm text-gray-600 w-full ${
              showFilter ? 'flex' : 'hidden sm:flex'
            }`}
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filterSpecialities.map((spec, index) => (
              <motion.p 
                key={index}
                onClick={() => {
                  if (spec === "All") {
                    navigate('/professional')
                  } else {
                    navigate(`/professional/${spec}`)
                  }
                  window.scrollTo(0, 0)
                }}
                variants={filterItemVariant}
                className={`cursor-pointer px-4 py-2 rounded-full border transition-all duration-300 w-full sm:w-auto text-center 
                  ${(speciality === spec) || (!speciality && spec === "All") 
                    ? 'bg-rose-600 text-white border-rose-600' 
                    : 'bg-white text-rose-600 border-gray-300'
                  }`}
              >
                {spec}
              </motion.p>
            ))}
          </motion.div>
        </div>

        {/* Doctor Cards or "No Doctors Found" */}
        {filterDoc && filterDoc.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filterDoc.map((item, index) => (
              <motion.div 
                key={index}
                variants={cardVariant}
                onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }}
                className="bg-white border border-rose-200 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <img 
                  className="w-full h-48 object-cover bg-rose-100" 
                  src={item.image} 
                  alt={item.name || 'professional'} 
                />
                <div className="p-4">
                  <div className={`flex items-center gap-2 text-sm ${
                    item.available ? 'text-green-500' : 'text-gray-500'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      item.available ? 'bg-green-500' : 'bg-gray-500'
                    }`}></span>
                    <span>{item.available ? 'Available' : 'Not Available'}</span>
                  </div>
                  <p className="text-gray-800 text-lg font-bold mt-2">{item.name}</p>
                  <p className="text-gray-600 text-sm mt-1">{item.speciality}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <p className="text-2xl text-gray-600 mb-4">No professionals found!</p>
            <p className="text-lg text-gray-500 text-center max-w-md">
              We couldn't find any professionals for the selected specialty. Try changing your filters or check back later.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Doctors