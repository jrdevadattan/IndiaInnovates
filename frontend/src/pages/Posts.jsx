import React, { useState, useEffect, useRef } from "react";
import { getReports, upvoteReport } from "../services/reports.service";
import IssueCard from "../components/IssueCard";
import FilterBar from "../components/FilterBar";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const Posts = () => {
  const container = useRef();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchReports = async () => {
    try {
      const { data } = await getReports({ sort: sort === "popular" ? "popular" : "newest", limit: 60 });
      setReports(data.reports || data || []);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // Poll every 30s for new reports
    const interval = setInterval(fetchReports, 30000);
    return () => clearInterval(interval);
  }, [sort]);

  const [deviceId] = useState(() => {
    let id = localStorage.getItem("nagrikeye_device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("nagrikeye_device_id", id);
    }
    return id;
  });

  const handleUpvote = async (reportId) => {
    try {
      await upvoteReport(reportId);
      // Optimistically toggle upvote in local state
      setReports(prev => prev.map(r => {
        if (r._id !== reportId && r.id !== reportId) return r;
        const id = r._id || r.id;
        const alreadyVoted = r.upvotedBy?.includes(deviceId);
        return {
          ...r,
          upvotes: alreadyVoted ? (r.upvotes || 1) - 1 : (r.upvotes || 0) + 1,
          upvotedBy: alreadyVoted
            ? (r.upvotedBy || []).filter(x => x !== deviceId)
            : [...(r.upvotedBy || []), deviceId]
        };
      }));
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  const filteredReports = reports
    .filter((r) => {
      if (!filter) return true;
      return r.selectedCategory === filter || r.category === filter;
    })
    .sort((a, b) => {
      if (sort === "popular") return (b.upvotes || 0) - (a.upvotes || 0);
      const aTime = a.createdAt?.seconds ?? new Date(a.createdAt).getTime() / 1000 ?? 0;
      const bTime = b.createdAt?.seconds ?? new Date(b.createdAt).getTime() / 1000 ?? 0;
      return bTime - aTime;
    });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    tl.fromTo('.posts-header',
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo('.posts-filter',
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
  }, { scope: container });

  useGSAP(() => {
    if (loading) return;

    gsap.fromTo('.posts-card',
      { y: 30, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out',
        overwrite: 'auto'
      }
    );
  }, { scope: container, dependencies: [loading, filteredReports] });

  return (
    <section ref={container} id="reports" className="w-full bg-[#F5F5F2] pt-0 pb-32 px-4 lg:px-12 relative z-10 font-sans">
      <div className="max-w-350 mx-auto">

        <div className="posts-header mb-12 text-center md:text-left">
          <h2 className="text-[50px] lg:text-[80px] leading-[0.95] font-medium text-[#2c2e2a] mb-6 tracking-tight">Community Feed</h2>
          <p className="text-[18px] lg:text-[20px] text-[#2c2e2a] max-w-2xl leading-relaxed opacity-80">
            Real-time updates on civic issues reported by citizens. Together we build a better city.
          </p>
        </div>

        <div className="posts-filter relative z-50">
          <FilterBar
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#339966]"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xl text-stone-400 font-medium">No reports found matching your criteria.</p>
            <button
              onClick={() => setFilter("")}
              className="mt-4 text-[#339966] font-bold hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReports.map((report) => (
              <div key={report.id} className="posts-card h-full">
                <IssueCard
                  report={report}
                  currentUserId={deviceId}
                  onUpvote={handleUpvote}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Posts;