import { Check, X } from 'lucide-react';
import Badge from '../common/Badge';

export default function BookingStatus({ status }) {
  const statuses = {
    pending: {
      label: 'Pending',
      badge: 'warning',
      icon: null,
    },
    confirmed: {
      label: 'Confirmed',
      badge: 'success',
      icon: Check,
    },
    cancelled: {
      label: 'Cancelled',
      badge: 'danger',
      icon: X,
    },
    completed: {
      label: 'Completed',
      badge: 'primary',
      icon: Check,
    },
  };

  const config = statuses[status] || statuses.pending;
  const Icon = config.icon;

  return (
    <Badge variant={config.badge} className="flex items-center gap-1">
      {Icon && <Icon className="w-3 h-3" />}
      {config.label}
    </Badge>
  );
}
