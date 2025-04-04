import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Doctors = () => {
    const navigate = useNavigate();
    const { doctors, getDoctosData } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [filters, setFilters] = useState({
        type: "",
        experience: "",
        priceRange: "",
    });

    // Get unique values for filters
    const types = [...new Set(doctors.map((doc) => doc.speciality))];

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getDoctosData();
                setLoading(false);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                toast.error("Failed to load professionals");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter and sort doctors
    const filteredDoctors = doctors
        .filter((doc) => {
            const matchesSearch = doc.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesType = !filters.type || doc.speciality === filters.type;

            // Convert experience string to number for comparison
            const experienceNum = parseInt(doc.experience) || 0;
            const matchesExperience =
                !filters.experience ||
                (filters.experience === "0-5" && experienceNum <= 5) ||
                (filters.experience === "5-10" && experienceNum > 5 && experienceNum <= 10) ||
                (filters.experience === "10+" && experienceNum > 10);

            const matchesPriceRange =
                !filters.priceRange ||
                (filters.priceRange === "low" && doc.fees <= 1000) ||
                (filters.priceRange === "medium" && doc.fees > 1000 && doc.fees <= 2000) ||
                (filters.priceRange === "high" && doc.fees > 2000);

            return matchesSearch && matchesType && matchesExperience && matchesPriceRange;
        })
        .sort((a, b) => {
            if (sortOption === "price-asc") return a.fees - b.fees;
            if (sortOption === "price-desc") return b.fees - a.fees;
            return 0;
        });

    // Animation variants
    const cardVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-rose-50 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Find Your Perfect Professional
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Connect with experienced professionals who can help you on your
                            journey to better well-being.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="lg:w-1/4">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6">Filters</h2>

                                {/* Professional Type Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Professional Type
                                    </label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) =>
                                            setFilters({ ...filters, type: e.target.value })
                                        }
                                        className="w-full border border-pink-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    >
                                        <option value="">All Types</option>
                                        {types.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Experience Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Years of Experience
                                    </label>
                                    <select
                                        value={filters.experience}
                                        onChange={(e) =>
                                            setFilters({ ...filters, experience: e.target.value })
                                        }
                                        className="w-full border border-pink-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    >
                                        <option value="">Any Experience</option>
                                        <option value="0-5">0-5 years</option>
                                        <option value="5-10">5-10 years</option>
                                        <option value="10+">10+ years</option>
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <select
                                        value={filters.priceRange}
                                        onChange={(e) =>
                                            setFilters({ ...filters, priceRange: e.target.value })
                                        }
                                        className="w-full border border-pink-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    >
                                        <option value="">All Prices</option>
                                        <option value="low">Under ₹1000</option>
                                        <option value="medium">₹1000 - ₹2000</option>
                                        <option value="high">Above ₹2000</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:w-3/4">
                            {/* Search & Sort Row */}
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                                {/* Search */}
                                <div className="relative w-full max-w-sm">
                                    <input
                                        type="text"
                                        placeholder="Search professionals..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-white border border-pink-200 rounded py-2 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-pink-200"
                                    />
                                    <svg
                                        className="w-4 h-4 text-gray-400 absolute left-2.5 top-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.29 3.71a7.5 7.5 0 016.36 12.94z"
                                        />
                                    </svg>
                                </div>
                                {/* Sort */}
                                <button
                                    onClick={() => {
                                        if (!sortOption) setSortOption("price-asc");
                                        else if (sortOption === "price-asc") setSortOption("price-desc");
                                        else setSortOption("");
                                    }}
                                    className="border border-pink-200 text-pink-500 px-4 py-2 rounded hover:bg-pink-50 transition-colors"
                                >
                                    {sortOption === ""
                                        ? "Sort"
                                        : sortOption === "price-asc"
                                            ? "Sort: Price (Low to High)"
                                            : "Sort: Price (High to Low)"}
                                </button>
                            </div>

                            {/* Doctors Grid */}
                            {filteredDoctors && filteredDoctors.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: { transition: { staggerChildren: 0.1 } },
                                    }}
                                >
                                    {filteredDoctors.map((doc) => (
                                        <motion.div
                                            key={doc._id}
                                            variants={cardVariant}
                                            onClick={() => {
                                                navigate(`/appointment/${doc._id}`);
                                                window.scrollTo(0, 0);
                                            }}
                                            className="bg-white border border-pink-200 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all"
                                        >
                                            {/* Doctor Image */}
                                            <div className="bg-pink-50 h-48 flex items-center justify-center">
                                                {doc.image ? (
                                                    <img
                                                        src={doc.image}
                                                        alt={doc.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-pink-300">No Image</span>
                                                )}
                                            </div>
                                            {/* Doctor Details */}
                                            <div className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-bold text-gray-700">{doc.name}</p>
                                                    <p className="text-pink-500 font-semibold">
                                                        ₹{doc.fees || 1000}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {doc.speciality} &bull; {doc.experience} years exp.
                                                </p>
                                                <button
                                                    className="mt-3 bg-pink-500 text-white w-full py-2 rounded hover:bg-pink-600 transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/appointment/${doc._id}`);
                                                        window.scrollTo(0, 0);
                                                    }}
                                                >
                                                    Book Session
                                                </button>
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
                                    <p className="text-2xl text-gray-600 mb-4">
                                        No professionals found!
                                    </p>
                                    <p className="text-lg text-gray-500 text-center max-w-md">
                                        We couldn't find any professionals matching your filters.
                                        Try changing your selections or check back later.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Doctors; 