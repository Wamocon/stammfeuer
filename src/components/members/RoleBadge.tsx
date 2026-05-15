import { useTranslations } from 'next-intl'
import type { MemberRole } from '@/types/database'
import { Badge } from '@/components/ui/Badge'

interface RoleBadgeProps {
  role: MemberRole
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const t = useTranslations('members')
  return <Badge variant={role}>{t(`roles.${role}`)}</Badge>
}
