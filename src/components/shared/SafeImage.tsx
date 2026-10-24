import { useState, type ImgHTMLAttributes } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Classes for the wrapper (sizing / rounding). The <img> always fills it. */
  wrapperClassName?: string
}

/** Image with a lazy fade-in and a neutral placeholder if the source fails. */
export default function SafeImage({ className, wrapperClassName, alt = '', src, ...props }: SafeImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(!src)

  return (
    <div className={cn('relative overflow-hidden bg-muted', wrapperClassName)}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary to-muted text-muted-foreground/60">
          <ImageOff className="h-6 w-6" aria-hidden />
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-500',
            loaded ? 'opacity-100' : 'opacity-0',
            className,
          )}
          {...props}
        />
      )}
    </div>
  )
}
