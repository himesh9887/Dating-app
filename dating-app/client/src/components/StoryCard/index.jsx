const StoryCard = ({ story, onClick }) => (
  <button
    type="button"
    onClick={() => onClick?.(story)}
    className="group flex w-20 flex-col items-center gap-2 text-center"
  >
    <div className="rounded-[26px] bg-spark-button p-[2px] transition group-hover:scale-105">
      <div className="rounded-[24px] bg-spark-base p-[3px]">
        <img
          src={story.author.profilePhotos?.[0]?.url}
          alt={story.author.name}
          className="h-16 w-16 rounded-[20px] object-cover"
        />
      </div>
    </div>
    <span className="line-clamp-1 text-xs text-white/70">{story.author.username}</span>
  </button>
);

export default StoryCard;
