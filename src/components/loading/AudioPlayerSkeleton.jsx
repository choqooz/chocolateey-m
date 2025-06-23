import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AudioPlayerSkeleton = ({ expanded = false }) => {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      {expanded ? (
        // Expanded Player Skeleton
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Skeleton height={24} width={120} />
            <div className="flex gap-2">
              <Skeleton height={32} width={32} className="rounded-md" />
              <Skeleton height={32} width={32} className="rounded-md" />
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Song Info */}
              <div className="flex items-start gap-6">
                <Skeleton height={128} width={128} className="rounded-xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton height={28} width="90%" />
                  <Skeleton height={20} width="70%" />
                  <Skeleton height={16} width="60%" />
                  <div className="flex gap-3 mt-4">
                    <Skeleton height={36} width={100} className="rounded-md" />
                    <Skeleton height={36} width={100} className="rounded-md" />
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <Skeleton height={6} className="rounded-full" />
                <div className="flex justify-between">
                  <Skeleton height={14} width={40} />
                  <Skeleton height={14} width={40} />
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Skeleton height={40} width={40} className="rounded-full" />
                <Skeleton height={40} width={40} className="rounded-full" />
                <Skeleton height={56} width={56} className="rounded-full" />
                <Skeleton height={40} width={40} className="rounded-full" />
                <Skeleton height={40} width={40} className="rounded-full" />
              </div>
            </div>

            {/* Right Column - Lyrics */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton height={20} width={20} />
                <Skeleton height={20} width={60} />
              </div>
              <div className="bg-slate-800/30 rounded-xl p-4 h-[500px] space-y-3">
                {Array.from({ length: 15 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    height={16}
                    width={`${Math.random() * 40 + 60}%`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Collapsed Player Skeleton
        <div className="h-full flex items-center px-4 gap-4">
          {/* Song Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Skeleton height={56} width={56} className="rounded-lg" />
            <div className="flex-1 space-y-1">
              <Skeleton height={16} width="70%" />
              <Skeleton height={12} width="50%" />
            </div>
          </div>

          {/* Progress (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md">
            <Skeleton height={4} className="rounded-full" />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Skeleton height={32} width={32} className="rounded-full" />
            <Skeleton height={40} width={40} className="rounded-full" />
            <Skeleton height={32} width={32} className="rounded-full" />
            <Skeleton height={32} width={32} className="rounded-full" />
          </div>
        </div>
      )}
    </SkeletonTheme>
  );
};

export default AudioPlayerSkeleton;
