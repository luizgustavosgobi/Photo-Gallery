interface LoadingSpinnerProps {
  message?: string | null;
  size?: "sm" | "md" | "lg";
  variant?: "block" | "inline";
  className?: string;
}

export default function LoadingSpinner({
  message = "Carregando...",
  size = "md",
  variant = "block",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  } as const;

  const spinner = (
    <span className={`relative inline-block ${sizeClasses[size]}`} aria-hidden="true">
      {/* gradient ring */}
      <span className="absolute -inset-1 rounded-full bg-linear-to-r from-pink-600/20 via-purple-600/15 to-transparent blur-sm" aria-hidden="true" />
      <span className={`${sizeClasses[size]} block rounded-full border-2 border-white/30 border-t-white ${size === 'lg' ? 'animate-spin-slow shadow-xl' : 'animate-spin shadow-md'}`} />
    </span>
  );
  if (variant === "inline") {
    return (
      <span role="status" aria-live="polite" className={`inline-flex items-center gap-2 ${className}`}>
        {spinner}
        {/* provide accessible label for screen readers */}
        {message ? <span className="sr-only">{message}</span> : null}
      </span>
    );
  }

  return (
    <div role="status" aria-live="polite" className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {spinner}
        {message && <p className="text-white/50 text-sm">{message}</p>}
      </div>
    </div>
  );
} 
