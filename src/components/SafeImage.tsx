import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

export default function SafeImage({ className, fallback, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)

  if (error && fallback) {
    return <img className={cn(className)} src={fallback} {...props} />
  }

  return (
    <img
      className={cn(className)}
      {...props}
      onError={() => setError(true)}
    />
  )
}
