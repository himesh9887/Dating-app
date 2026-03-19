import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { getPrimaryPhoto } from "../../utils/helpers";

const StoryItem = ({ username, image, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-16 shrink-0 flex-col items-center transition-all duration-300 hover:scale-105 active:scale-95"
  >
    <div className="rounded-full bg-[linear-gradient(135deg,#f9ce34_0%,#ee2a7b_52%,#6228d7_100%)] p-[2px]">
      <div className="rounded-full bg-black p-[2px]">
        <img
          src={image}
          alt={username}
          className="h-16 w-16 rounded-full object-cover"
        />
      </div>
    </div>
    <span className="mt-1 line-clamp-1 w-full text-center text-xs text-white">
      {username}
    </span>
  </button>
);

const Stories = ({ stories, currentUser, onCreateStory, onStoryClick }) => (
  <motion.section
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="spark-scrollbar overflow-x-auto border-b border-[#262626] px-3 py-2"
  >
    <div className="flex w-max gap-4">
      <button
        type="button"
        onClick={onCreateStory}
        className="flex w-16 shrink-0 flex-col items-center transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <img
            src={getPrimaryPhoto(currentUser)}
            alt={currentUser?.name || "Your story"}
            className="h-16 w-16 rounded-full border border-[#262626] object-cover"
          />
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0095f6] text-white">
            <Plus size={13} strokeWidth={2.8} />
          </span>
        </div>
        <span className="mt-1 line-clamp-1 w-full text-center text-xs text-white">
          Your story
        </span>
      </button>

      {stories.map((story) => (
        <StoryItem
          key={story._id}
          username={story.author.username}
          image={getPrimaryPhoto(story.author)}
          onClick={() => onStoryClick?.(story)}
        />
      ))}
    </div>
  </motion.section>
);

export default Stories;
