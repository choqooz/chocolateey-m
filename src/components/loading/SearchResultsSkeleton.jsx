import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SearchResultsSkeleton = () => {
  return (
    <SkeletonTheme baseColor="#1e293b" highlightColor="#334155">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton height={24} width="200px" />
          <Skeleton height={16} width="300px" />
        </div>

        {/* Results Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-xl overflow-hidden">
              {/* Image Skeleton */}
              <Skeleton height={200} />

              {/* Content Skeleton */}
              <div className="p-4 space-y-3">
                <Skeleton height={20} width="90%" />
                <Skeleton height={16} width="70%" />
                <Skeleton height={14} width="60%" />

                {/* Actions Skeleton */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex gap-2">
                    <Skeleton height={32} width={32} className="rounded-full" />
                    <Skeleton height={32} width={32} className="rounded-full" />
                  </div>
                  <Skeleton height={32} width={80} className="rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SearchResultsSkeleton;
