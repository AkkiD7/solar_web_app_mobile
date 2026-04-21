import { SolarBrand } from '../ui/SolarBrand';
import { SolarBackdrop } from '../ui/SolarBackdrop';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left pane - Brand / Visual (hidden on smaller screens) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-surfaceMuted border-r border-border items-center justify-center overflow-hidden">
        <SolarBackdrop size={800} className="opacity-60" />
        <div className="relative z-10 p-12">
          <SolarBrand size="hero" subtitle="Precision management for the modern energy enterprise." />
        </div>
      </div>

      {/* Right pane - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-32 relative">
        {/* Mobile background visual */}
        <div className="absolute inset-0 lg:hidden overflow-hidden pointer-events-none">
          <SolarBackdrop size={400} className="-top-20 -right-20 opacity-30" />
        </div>

        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="lg:hidden mb-12 flex justify-center">
            <SolarBrand size="large" centered />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
