import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import TutorCard from '../components/TutorCard';
import { UserProfile } from '../types';
import { Search, Star, Award, BookOpen, GraduationCap, Loader2 } from 'lucide-react';

export default function TutorProfiles() {
  const { tutors, expertiseList, apex } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');
  const [maxHourlyRate, setMaxHourlyRate] = useState('50');

  const [displayedTutors, setDisplayedTutors] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced Search & Filter Logic
  useEffect(() => {
    const runSearch = async () => {
      setIsSearching(true);
      let baseList = tutors;

      try {
        // 1. OSE Full-Text Search (Tantivy Engine)
        if (searchQuery.trim().length > 0) {
          // Send query to OSE, filtering out students at the database level
          const res = await apex.collection('users_profiles').searchRecordsWithOSE(searchQuery, {
            filter: { role: 'tutor' },
            limit: 50 // Fetch top 50 matches
          });

          // Unfold the results into standard UserProfile objects
          baseList = res.items.map((item: any) => ({
            id: String(item.id),
            ...item.data,
            created: item.created,
            updated: item.updated
          })) as unknown as UserProfile[];
        }

        // 2. Client-Side Post-Filtering (Expertise & Hourly Rate)
        const finalFiltered = baseList.filter((tutor) => {
          const matchesExpertise =
            selectedExpertise === '' ||
            tutor.expertise?.some(
              (exp) => exp.toLowerCase() === selectedExpertise.toLowerCase()
            );

          const matchesRate = (tutor.hourlyRate || 0) <= Number(maxHourlyRate);

          return matchesExpertise && matchesRate;
        });

        setDisplayedTutors(finalFiltered);
      } catch (err) {
        console.error('OSE Search Failed:', err);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce the search to prevent spamming the backend while typing
    const timeoutId = setTimeout(() => {
      runSearch();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedExpertise, maxHourlyRate, tutors, apex]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="tutor_profiles_page">
      
      {/* 1. Page Header */}
      <div className="text-center md:text-left space-y-2 mb-8">
        <span className="text-[10px] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/55 text-sky-700 dark:text-sky-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
          EduSolve Academic Network
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white heading-font tracking-tight">
          Browse Verified University Tutors
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Connect directly with Ivy League graduates, PhD lecturers, and expert engineering, physics, or humanities coaches.
        </p>
      </div>

      {/* 2. Advanced Search & Filtering Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative">
        
        {/* Text Search */}
        <div className="md:col-span-5 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 pl-10 pr-4 py-2.5 rounded-xl outline-none text-xs text-slate-800 dark:text-slate-100 transition-all animate-none"
            placeholder="Search coaches by name, bio, or keywords..."
          />
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Dynamic Expertise select */}
        <div className="md:col-span-3 relative">
          <select
            value={selectedExpertise}
            onChange={(e) => setSelectedExpertise(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 focus:border-sky-500 focus:bg-white dark:focus:bg-slate-900 px-3.5 py-2.5 rounded-xl outline-none text-xs text-slate-800 dark:text-slate-100 transition-all cursor-pointer"
          >
            <option value="" className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">All Subject Expertise</option>
            {expertiseList.map((exp) => (
              <option key={exp} value={exp} className="dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                {exp}
              </option>
            ))}
          </select>
        </div>

        {/* Price Slider */}
        <div className="md:col-span-4 flex items-center gap-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 px-3.5 py-1.5 rounded-xl">
          <div className="flex-1">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block leading-none">Max hourly rate</span>
            <input
              type="range"
              min="10"
              max="150"
              step="5"
              value={maxHourlyRate}
              onChange={(e) => setMaxHourlyRate(e.target.value)}
              className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-600 mt-2"
            />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg">
            ${maxHourlyRate}/hr
          </span>
        </div>

      </div>

      {/* 3. Filtered Tutor Grid */}
      {displayedTutors.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <GraduationCap className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base heading-font">No Matching Tutors Found</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto mt-1 leading-normal">
            We couldn't locate active tutoring profiles matching your search parameters. Please try broadening your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="tutors_list_grid">
          {displayedTutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}

    </div>
  );
}