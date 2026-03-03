import { useSocialProfiles } from "../hooks/useSocialProfiles";
import SocialProfileCard from "./SocialProfileCard";
import { motion } from "framer-motion";

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-white/10 rounded" />
            <div className="h-3 w-16 bg-white/10 rounded" />
            <div className="h-3 w-32 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="text-center py-4">
      <p className="text-white/50 text-sm">Unable to load social profiles</p>
      <p className="text-white/30 text-xs mt-1">{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <p className="text-white/40 text-sm">No social profiles connected yet.</p>
    </div>
  );
}

export default function SocialProfilesSection({
  youtubeId,
  githubUser,
  telegramUser,
}) {
  const { data, loading, error } = useSocialProfiles({
    youtubeId,
    githubUser,
    telegramUser,
  });

  if (loading) {
    return (
      <div className="space-y-3">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const platforms = [];

  if (data.youtube && !data.youtube.error) {
    platforms.push({
      key: "youtube",
      platform: "youtube",
      name: data.youtube.name,
      username: youtubeId,
      avatar: data.youtube.avatar,
      profileUrl: data.youtube.profileUrl,
      extraData: {
        subscribers: data.youtube.subscribers,
        videos: data.youtube.videos,
        views: data.youtube.views,
      },
    });
  }

  if (data.github && !data.github.error) {
    platforms.push({
      key: "github",
      platform: "github",
      name: data.github.name,
      username: githubUser,
      avatar: data.github.avatar,
      profileUrl: data.github.profileUrl,
      extraData: {
        followers: data.github.followers,
        repos: data.github.repos,
      },
    });
  }

  if (data.telegram && !data.telegram.error) {
    platforms.push({
      key: "telegram",
      platform: "telegram",
      name: data.telegram.name,
      username: data.telegram.username,
      avatar: data.telegram.avatar,
      profileUrl: data.telegram.profileUrl,
      extraData: {},
    });
  }

  if (platforms.length === 0) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className="space-y-3"
    >
      {platforms.map((item) => (
        <motion.div
          key={item.key}
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <SocialProfileCard
            platform={item.platform}
            name={item.name}
            username={item.username}
            avatar={item.avatar}
            profileUrl={item.profileUrl}
            extraData={item.extraData}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
