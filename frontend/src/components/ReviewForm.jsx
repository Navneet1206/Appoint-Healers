import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const ReviewForm = ({ appointmentId, docId, userId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await axios.post('/api/review/add', {
                userId,
                docId,
                appointmentId,
                rating,
                comment
            })

            if (response.data.success) {
                toast.success('Review submitted successfully')
                setComment('')
                if (onReviewSubmitted) {
                    onReviewSubmitted()
                }
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error submitting review')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">Rating</label>
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block mb-1">Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="4"
                        placeholder="Share your experience..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    )
}

export default ReviewForm 