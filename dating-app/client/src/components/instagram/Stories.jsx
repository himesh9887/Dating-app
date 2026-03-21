import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { formatTimeAgo, getPrimaryPhoto } from "../../utils/helpers";

const StoryItem = ({ story, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-[104px] shrink-0 flex-col items-center gap-2 text-center transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
  >
    <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-3 shadow-lift">
      <div className="rounded-full bg-spark-gradient p-[2px]">
        <div className="rounded-full bg-spark-base p-[3px]">
          <img
            src={getPrimaryPhoto(story.author)}
            alt={story.author.username}
            className="h-[72px] w-[72px] rounded-full object-cover"
          />
        </div>
      </div>
    </div>
    <div className="w-full">
      <span className="line-clamp-1 block text-[12px] font-semibold leading-4 text-white/92">
        {story.author.username}
      </span>
      <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-white/38">
        {formatTimeAgo(story.createdAt)}
      </span>
    </div>
  </button>
);

const Stories = ({ stories, currentUser, onCreateStory, onStoryClick }) => (
  <motion.section
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="spark-scrollbar overflow-x-auto"
  >
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
          Story rail
        </p>
        <h2 className="mt-2 font-display text-[1.65rem] font-semibold text-white">Live moments</h2>
      </div>
      <button
        type="button"
        onClick={onCreateStory}
        className="spark-button-ghost"
      >
        <Plus size={16} />
        Add story
      </button>
    </div>

    <div className="flex w-max gap-4 pb-1">
      <button
        type="button"
        onClick={onCreateStory}
        className="group flex w-[104px] shrink-0 flex-col items-center gap-2 text-center transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
      >
        <div className="relative rounded-[30px] border border-white/10 bg-white/[0.03] p-3 shadow-lift">
          <img
            src={getPrimaryPhoto(currentUser)}
            alt={currentUser?.name || "Your story"}
            className="h-[78px] w-[78px] rounded-full border border-white/10 object-cover"
          />
          <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-spark-gradient text-spark-base shadow-glow">
            <Plus size={14} strokeWidth={2.8} />
          </span>
        </div>
        <div className="w-full">
          <span className="line-clamp-1 block text-[12px] font-semibold leading-4 text-white/92">
            Your story
          </span>
          <span className="mt-1 block text-[10px] uppercase tracking-[0.2em] text-white/38">
            Create
          </span>
        </div>
      </button>

      {stories.map((story) => (
        <StoryItem
          key={story._id}
          story={story}
          onClick={() => onStoryClick?.(story)}
        />
      ))}
    </div>
  </motion.section>
);

export default Stories;
