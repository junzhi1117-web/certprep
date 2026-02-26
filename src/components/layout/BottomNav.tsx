interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'progress', label: 'Progress', icon: '📊' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

interface BottomNavProps {
  active: string;
  onNavigate: (id: string) => void;
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      style={{ paddingBottom: 'calc(8px + var(--safe-bottom))' }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200/60 z-30"
    >
      <div className="flex justify-around items-center pt-2 max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-0.5 px-4 py-1 border-none bg-transparent cursor-pointer transition-transform duration-150 active:scale-95"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span
                className="text-[10px] font-semibold transition-colors duration-200"
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)' }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
