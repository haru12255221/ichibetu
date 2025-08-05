interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Loading({ size = 'md', text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}