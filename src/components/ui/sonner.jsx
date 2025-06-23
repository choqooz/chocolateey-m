import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'rgb(15 23 42)', // slate-900
          border: '1px solid rgb(71 85 105)', // slate-600
          color: 'rgb(248 250 252)', // slate-50
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
