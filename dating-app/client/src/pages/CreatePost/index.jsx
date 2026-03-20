import { Hash, ImagePlus, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageShell from "../../components/common/PageShell";
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
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hashtagCount = toHashtagArray(hashtags).length;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      await dispatch(
        createPost({
          caption,
          hashtags: toHashtagArray(hashtags),
          media: file,
          preview,
        }),
      ).unwrap();
      navigate("/home");
    } catch (_error) {
      setStatusMessage("Post could not be shared right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell
      eyebrow="Creator studio"
      title="Publish a post that feels ready for the feed"
      subtitle="Upload media, shape the caption, refine hashtags, and preview everything before it lands on your profile."
      stats={[
        { label: "Caption length", value: caption.length, meta: "Chars" },
        { label: "Hashtags", value: hashtagCount, meta: "Tags" },
        { label: "Media", value: preview ? "Ready" : "Missing", meta: preview ? "Preview" : "Upload" },
      ]}
    >
      <section className="glass-panel p-5 lg:p-6">
        <SectionHeader
          title="Create post"
          subtitle="Build a clean preview, then share it once everything feels right."
        />

        <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.95fr)_minmax(0,1.05fr)]">
          <div className="glass-soft flex min-h-[360px] items-center justify-center overflow-hidden p-4 lg:min-h-[560px]">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full rounded-[28px] object-cover"
              />
            ) : (
              <div className="max-w-sm text-center text-white/50">
                <ImagePlus
                  className="mx-auto mb-3"
                  size={34}
                />
                Upload an image to see a polished feed preview before posting.
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <label className="glass-soft flex cursor-pointer items-center gap-3 p-4">
              <ImagePlus size={18} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">Choose image</p>
                <p className="mt-1 text-xs text-white/50">
                  {file ? file.name : "PNG, JPG, or any photo ready for the feed"}
                </p>
              </div>
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

            <label className="glass-soft block p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                Caption
              </p>
              <textarea
                className="mt-3 min-h-40 w-full resize-none bg-transparent text-[15px] leading-7 text-white placeholder:text-white/30"
                placeholder="Tell your feed what this moment feels like..."
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
              />
            </label>

            <label className="glass-soft block p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                Hashtags
              </p>
              <div className="mt-3 flex items-center gap-3">
                <Hash
                  className="text-white/35"
                  size={16}
                />
                <input
                  className="w-full bg-transparent text-[15px] text-white placeholder:text-white/30"
                  placeholder="Hashtags separated by commas"
                  value={hashtags}
                  onChange={(event) => setHashtags(event.target.value)}
                />
              </div>
            </label>

            <div className="glass-soft p-4 text-sm text-white/60">
              <div className="mb-2 flex items-center gap-2 font-medium text-white">
                <WandSparkles size={16} />
                Preview vibe
              </div>
              Rounded media card, cleaner caption hierarchy, and hashtags that feel ready for engagement.
            </div>

            {statusMessage ? (
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">
                {statusMessage}
              </div>
            ) : null}

            <button
              type="submit"
              className="spark-button w-full lg:w-auto"
            >
              {isSubmitting ? "Sharing..." : "Share post"}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
};

export default CreatePostPage;
