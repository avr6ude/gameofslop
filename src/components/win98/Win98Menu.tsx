import { useEffect, useRef, useState } from 'react';

export type MenuItem = {
  label: string;
  action?: () => void;
  separator?: false;
  disabled?: boolean;
} | {
  separator: true;
  label?: never;
  action?: never;
  disabled?: never;
};

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

interface Win98MenuProps {
  items: MenuGroup[];
}

export function Win98Menu({ items }: Win98MenuProps) {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={menuRef}
      className="menu-bar"
      style={{
        display: 'flex',
        padding: '2px',
        background: '#c0c0c0',
        borderBottom: '1px solid #808080',
        fontSize: '11px',
        userSelect: 'none',
      }}
    >
      {items.map((group, gi) => (
        <div key={gi} style={{ position: 'relative' }}>
          <div
            style={{
              padding: '2px 6px',
              cursor: 'default',
              background: openMenu === gi ? '#000080' : 'transparent',
              color: openMenu === gi ? '#fff' : '#000',
            }}
            onClick={() => setOpenMenu(openMenu === gi ? null : gi)}
            onMouseEnter={() => {
              if (openMenu !== null) setOpenMenu(gi);
            }}
          >
            {group.label}
          </div>

          {openMenu === gi && (
            <div
              className="window"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                minWidth: '150px',
                zIndex: 10001,
              }}
            >
              <div className="window-body" style={{ margin: 0, padding: '2px' }}>
                {group.items.map((item, ii) =>
                  item.separator ? (
                    <hr key={ii} style={{ margin: '2px 0' }} />
                  ) : (
                    <div
                      key={ii}
                      style={{
                        padding: '3px 16px',
                        cursor: item.disabled ? 'default' : 'pointer',
                        color: item.disabled ? '#808080' : '#000',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!item.disabled) {
                          (e.target as HTMLElement).style.background = '#000080';
                          (e.target as HTMLElement).style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.background = '';
                        (e.target as HTMLElement).style.color = item.disabled ? '#808080' : '#000';
                      }}
                      onClick={() => {
                        if (!item.disabled && item.action) {
                          item.action();
                          setOpenMenu(null);
                        }
                      }}
                    >
                      {item.label}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
