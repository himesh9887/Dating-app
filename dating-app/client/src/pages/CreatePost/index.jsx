import { ImagePlus, Hash, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import { createPost } from "../../redux/slices/postSlice";
import { toHashtagArray } from "../../utils/helpers";

const CreatePostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [caption, setCaption] = useState("Late-night espresso and a better outfit.");
  const [hashtags, setHashtags] = useState("nightout, citylights, spark");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  return (
    <div className="glass-panel p-5">
      <SectionHeader
        title="Create Post"
        subtitle="Upload an image, add a caption, and preview before sharing."
      />
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-soft flex min-h-[420px] items-center justify-center p-5">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full rounded-[28px] object-cover" />
          ) : (
            <div className="text-center text-white/50">
              <ImagePlus className="mx-auto mb-3" size={32} />
              Upload an image to see the preview.
            </div>
          )}
        </div>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await dispatch(
              createPost({
                caption,
                hashtags: toHashtagArray(hashtags),
                media: file,
                preview,
              }),
            ).unwrap();
            navigate("/home");
          }}
          className="space-y-4"
        >
          <label className="glass-soft flex cursor-pointer items-center gap-3 p-4">
            <ImagePlus size={18} />
            <span className="text-sm text-white/75">Choose image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const nextFile = event.target.files?.[0];
                setFile(nextFile);
                setPreview(nextFile ? URL.createObjectURL(nextFile) : "");
              }}
            />
          </label>
          <textarea
            className="spark-input min-h-36"
            placeholder="Tell your feed what this moment feels like..."
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />
          <div className="relative">
            <Hash className="absolute left-4 top-3.5 text-white/[0.35]" size={16} />
            <input
              className="spark-input pl-10"
              placeholder="Hashtags separated by commas"
              value={hashtags}
              onChange={(event) => setHashtags(event.target.value)}
            />
          </div>
          <div className="glass-soft p-4 text-sm text-white/60">
            <div className="mb-2 flex items-center gap-2 font-medium text-white">
              <WandSparkles size={16} />
              Preview vibe
            </div>
            Rounded media card, caption overlay, hashtags, likes, and comment-ready layout.
          </div>
          <button type="submit" className="spark-button">
            Share post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;

