import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import useAuthStore from "../store/authStore";
import { useRef } from "react";

const Form = () => {
  const user = useAuthStore((s) => s.user);

  const containerWrap = useRef(null);
  const t1 = useRef(null);
  const hasPlayed = useRef(false);

  useGSAP(
    () => {
      t1.current = gsap.timeline({ paused: true });

      t1.current.to(".form-cover", {
        y: "-90%",
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        pointerEvents: "none",
      });
    },
    { scope: containerWrap }
  );

  const handleMouseEnter = () => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    t1.current.play();
  };

  return (
    <div
      ref={containerWrap}
      onMouseEnter={handleMouseEnter}
      className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 relative font-sans"
    >
      <div className="flex items-center gap-3 mb-6">
        <img
          src={user?.avatar}
          alt="User"
          className="rounded-full object-cover h-10 w-10 ring-2 ring-[#8ED462]/30"
          draggable="false"
        />
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-wide font-medium">Reporting as</p>
          <h3 className="font-semibold text-[#1a1a1a] text-[15px]">{user?.name || 'Anonymous'}</h3>
        </div>
      </div>

      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Brief Problem Title"
          className="w-full rounded-xl bg-[#F5F5F2] px-4 py-3 text-[#1a1a1a] placeholder-stone-400 border border-transparent focus:border-[#8ED462] focus:bg-white outline-none transition-all text-[15px]"
        />

        <textarea
          rows={6}
          placeholder="What's the issue? Describe it in detail..."
          className="w-full rounded-xl bg-[#F5F5F2] px-4 py-3 text-[#1a1a1a] placeholder-stone-400 border border-transparent focus:border-[#8ED462] focus:bg-white outline-none transition-all text-[15px] resize-none"
        />

        <select className="w-full rounded-xl bg-[#F5F5F2] px-4 py-3 text-[#1a1a1a] border border-transparent focus:border-[#8ED462] focus:bg-white outline-none transition-all text-[15px] cursor-pointer">
          <option value="">Select a category</option>
          <option>Construction</option>
          <option>Sanitary</option>
          <option>Traffic</option>
          <option>Pollution</option>
          <option>Corruption</option>
        </select>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 py-3 rounded-xl border-2 border-stone-200 bg-white text-[#1a1a1a] font-medium text-[15px] hover:border-[#8ED462] transition-colors cursor-pointer"
          >
            Upload Photo
          </button>
          <button
            type="button"
            className="flex-1 py-3 rounded-xl border-2 border-stone-200 bg-white text-[#1a1a1a] font-medium text-[15px] hover:border-[#8ED462] transition-colors cursor-pointer"
          >
            Add Location
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-[#1a1a1a] text-white font-semibold text-[16px] hover:bg-black transition-colors cursor-pointer"
        >
          Submit Report
        </button>
      </form>

      <div
        className="form-cover absolute inset-0 rounded-2xl z-10 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url(/eyesBg.gif)" }}
      />
    </div>
  );
};

export default Form;
