import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initialsFromUser, type DashboardUser } from "@/lib/dashboard"
import { cn } from "@/lib/utils"

type UserAvatarProps = {
  user: Pick<DashboardUser, "name" | "email" | "avatarUrl">
  size?: "default" | "sm" | "lg"
  className?: string
}

export function UserAvatar({ user, size = "default", className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={cn("ring-2 ring-brand-blush", className)}>
      {user.avatarUrl ? (
        <AvatarImage src={user.avatarUrl} alt="" />
      ) : null}
      <AvatarFallback className="bg-brand-teal/15 text-xs font-medium text-brand-ink">
        {initialsFromUser(user)}
      </AvatarFallback>
    </Avatar>
  )
}
