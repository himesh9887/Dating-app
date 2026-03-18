import { getPrimaryPhoto } from "../../utils/helpers";

const StoryCard = ({ story, onClick }) => (
  <button
    type="button"
    onClick={() => onClick?.(story)}
    className="group flex w-[92px] shrink-0 flex-col items-center gap-2 text-center font-sans"
  >
    <div
      className="rounded-full p-[4px] transition duration-200 group-hover:scale-105"
      style={{
        backgroundImage:
          "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 52%, #6228d7 100%)",
      }}
    >
      <div className="rounded-full bg-black p-[3px]">
        <img
          src={getPrimaryPhoto(story.author)}
          alt={story.author.name}
          className="h-[78px] w-[78px] rounded-full object-cover"
        />
      </div>
    </div>
    <span className="line-clamp-1 w-full text-[12.5px] font-medium leading-4 text-white/90">
      {story.author.username}
    </span>
  </button>
);

export default StoryCard;
