import { useState } from "react";
import { ImageIcon } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
}

export default function SafeImage({ fallback, ...props }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
        {fallback ?? <ImageIcon className="h-8 w-8" />}
      </div>
    );
  }

  return <img {...props} onError={() => setError(true)} />;
}
