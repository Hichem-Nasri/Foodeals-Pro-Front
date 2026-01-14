import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export default function AvatarAndFallBack({
  fallback,
  src,
  className = '',
  alt,
}: {
  src?: string
  fallback: string
  className?: string
  alt?: string
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt || `${fallback} profile image`} />
      <AvatarFallback className='bg-lynch-200'>
        {fallback?.toUpperCase().slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  )
}
