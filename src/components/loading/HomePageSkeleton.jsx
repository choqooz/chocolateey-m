import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HomePageSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="p-6 space-y-8">
        {/* Greeting Header Skeleton */}
        <div className="space-y-2">
          <Skeleton height={36} width="250px" />
          <Skeleton height={20} width="350px" />
        </div>

        {/* Quick Play Section Skeleton */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton height={24} width="200px" />
            <Skeleton height={20} width="80px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-slate-800/30 rounded-lg overflow-hidden">
                <div className="flex items-center p-3">
                  <Skeleton height={64} width={64} className="rounded-lg" />
                  <div className="flex-1 ml-3">
                    <Skeleton height={16} width="80%" />
                    <Skeleton height={12} width="60%" className="mt-1" />
                  </div>
                  <Skeleton height={32} width={32} className="rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Playlists Skeleton */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton height={24} width="180px" />
            <Skeleton height={20} width="80px" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-lg overflow-hidden">
                <Skeleton height={160} />
                <div className="p-4">
                  <Skeleton height={16} width="90%" />
                  <Skeleton height={12} width="70%" className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Search Skeleton */}
        <section className="space-y-4">
          <Skeleton height={24} width="160px" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <Skeleton key={index} height={48} className="rounded-lg" />
            ))}
          </div>
        </section>

        {/* Actions Section Skeleton */}
        <section className="space-y-4">
          <Skeleton height={24} width="180px" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Skeleton height={48} width={48} className="rounded-full" />
                  <div className="flex-1">
                    <Skeleton height={16} width="80%" />
                    <Skeleton height={12} width="60%" className="mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SkeletonTheme>
  );
};

export default HomePageSkeleton;
