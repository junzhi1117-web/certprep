interface BadgeProps {
  label: string;
  variant: 'success' | 'warning' | 'secondary' | 'primary';
}

const variantStyles: Record<BadgeProps['variant'], { bg: string; color: string }> = {
  success: { bg: '#E8F9ED', color: '#1B8A3B' },
  warning: { bg: '#FFF3E0', color: '#E67E00' },
  secondary: { bg: '#F2F2F7', color: '#8E8E93' },
  primary: { bg: '#E5F1FF', color: '#007AFF' },
};

export function Badge({ label, variant }: BadgeProps) {
  const styles = variantStyles[variant];
  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: styles.bg, color: styles.color }}
    >
      {label}
    </span>
  );
}
