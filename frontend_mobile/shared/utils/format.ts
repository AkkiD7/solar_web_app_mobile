export function formatCurrency(value: number | null | undefined, currency = 'INR') {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export function formatDate(value: string | Date | null | undefined, pattern = 'DD/MM/YYYY') {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());

  switch (pattern) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
}

export function formatLongDate(value: string | Date | null | undefined) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(value: string | Date | null | undefined) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatFollowUpLabel(value: string | Date | null | undefined) {
  if (!value) {
    return 'Follow up soon';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (target.getTime() === today.getTime()) {
    return 'Today';
  }

  if (target.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }

  return formatShortDate(date);
}
