import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquare, Award, BookOpen, X, ShieldCheck, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TutorCardProps {
  tutor: UserProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const { startChat, currentUser, reviews } = useStore();
  const navigate = useNavigate();
  const [reviewsOpen, setReviewsOpen] = useState(false);

  // STRICT type-coerced filtration of reviews belonging to this tutor
  const tutorReviews = useMemo(() => {
    return reviews.filter(r => String(r.tutorId) === String(tutor.id));
  }, [reviews, tutor.id]);

  const handleContact = () => {
    startChat(tutor.id);
    navigate('/dashboard?tab=messages');
  };

  // Render Star ratings dynamically
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col" id={`tutor_card_${tutor.id}`}>
      {/* Visual profile header */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={tutor.avatar || 'https://api.dicebear.com/7.x/pixel-art/svg'}
            alt={tutor.name}
            className="w-18 h-18 rounded-full border-2 border-slate-100 dark:border-slate-800 shadow-sm object-cover"
          />
          {tutor.completedTasks && tutor.completedTasks > 5 && (
            <div
              className="absolute -bottom-1 -right-1 bg-sky-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
              title="Vetted Expert Tutor"
            >
              <Award className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Name & Rate */}
        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-3.5 heading-font leading-none">{tutor.name}</h4>
        <p className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider mt-1.5">${tutor.hourlyRate}/hour rate</p>

        {/* Rating and completed tasks count (Interactive Trigger) */}
        <button
          onClick={() => setReviewsOpen(true)}
          type="button"
          className="flex items-center gap-1.5 mt-2.5 hover:underline cursor-pointer group"
          title="Click to view verified reviews"
        >
          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs">
            <Star className="w-4 h-4 fill-amber-500" /> {tutor.rating || '5.0'}
          </div>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold group-hover:text-sky-650 transition-colors">
            {tutor.completedTasks || 0} completed tasks
          </span>
        </button>

        {/* Bio */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mt-3 leading-relaxed">
          {tutor.bio || 'Professional academic coach specializing in advanced university engineering subjects.'}
        </p>

        {/* Subject badges */}
        {tutor.expertise && tutor.expertise.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mt-4">
            {tutor.expertise.map((exp, idx) => (
              <span
                key={idx}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2.5 py-0.5 rounded-lg mono-font flex items-center gap-1"
              >
                <BookOpen className="w-2.5 h-2.5 text-slate-400 dark:text-slate-500" />
                {exp}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hire/Message Footer */}
      {currentUser?.id !== tutor.id && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 shrink-0 flex gap-2">
          {/* Read Reviews button */}
          <button
            onClick={() => setReviewsOpen(true)}
            className="flex-1 py-2 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
          >
            Reviews ({tutorReviews.length})
          </button>
          <button
            onClick={handleContact}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-sky-600 text-white font-semibold rounded-xl text-xs hover:bg-sky-700 cursor-pointer shadow-sm shadow-sky-500/10 transition-all duration-200"
          >
            <MessageSquare className="w-4 h-4" />
            Discuss specs
          </button>
        </div>
      )}

      {/* Dynamic Tutor Reviews Modal */}
      <AnimatePresence>
        {reviewsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id={`reviews_modal_${tutor.id}`}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 object-cover"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm heading-font">
                      {tutor.name}'s Feedback
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                      {renderStars(tutor.rating || 5.0)}
                      <span className="font-bold text-slate-700 dark:text-slate-300">({tutorReviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setReviewsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 dark:hover:text-slate-350 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Reviews List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40 dark:bg-slate-950/10">
                {tutorReviews.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                    <p className="text-xs font-semibold">No reviews posted yet</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[200px] mx-auto">
                      This tutor has not completed any rated contracts on the platform yet.
                    </p>
                  </div>
                ) : (
                  tutorReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-2.5 animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{rev.studentName}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Reviewed on assignment</span>
                        </div>
                        <div className="text-right shrink-0">
                          {renderStars(rev.rating)}
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {rev.created ? new Date(rev.created).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </div>

                      {/* Assignment title link */}
                      <p className="text-[10px] text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/40 border border-sky-100/50 dark:border-sky-900/40 px-2.5 py-1 rounded-lg">
                        Task: {rev.assignmentTitle}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed whitespace-pre-wrap">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Student Reviews
                </span>
                <button 
                  onClick={() => setReviewsOpen(false)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close Feedback
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}