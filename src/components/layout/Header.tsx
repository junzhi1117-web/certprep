interface HeaderProps {
  title: string;
  leftAction?: { label: string; onClick: () => void };
  rightAction?: { label: string; onClick: () => void };
}

export function Header({ title, leftAction, rightAction }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-gray-200/60"
      style={{ paddingTop: 'var(--safe-top)' }}
    >
      <div className="flex items-center justify-between px-4 h-11 max-w-lg mx-auto">
        <div className="w-20 text-left">
          {leftAction && (
            <button
              onClick={leftAction.onClick}
              className="text-[17px] font-normal border-none bg-transparent cursor-pointer px-0"
              style={{ color: 'var(--color-primary)' }}
            >
              {leftAction.label}
            </button>
          )}
        </div>
        <h1 className="text-[17px] font-semibold m-0 truncate">{title}</h1>
        <div className="w-20 text-right">
          {rightAction && (
            <button
              onClick={rightAction.onClick}
              className="text-[17px] font-semibold border-none bg-transparent cursor-pointer px-0"
              style={{ color: 'var(--color-danger)' }}
            >
              {rightAction.label}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
