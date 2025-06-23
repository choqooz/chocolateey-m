import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '../../lib/utils';

function Progress({ className, value, ...props }) {
  const progressValue = value || 0;

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'relative h-2 w-full overflow-hidden rounded-full bg-slate-700/50 border border-slate-600/30 group',
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full"
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      />

      {/* Círculo del progreso - pequeño para que quepa dentro del componente */}
      <div
        className="absolute top-1/2 w-1.5 h-1.5 -mt-0.5 bg-white border border-blue-300 rounded-full shadow-sm transition-all duration-300 pointer-events-none group-hover:scale-150 group-hover:border-blue-400"
        style={{
          left: `${progressValue}%`,
          transform: 'translateX(-50%)',
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
