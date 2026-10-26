import { type KeyboardEvent, type ReactNode, useEffect, useRef } from 'react';
import styles from './Drawer.module.scss';

export function Drawer ({
  open,
  onDismiss,
  label,
  children,
  className = '',
}: {
  open: boolean;
  onDismiss: () => void;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (open && !element.open) element.showModal();
    element.dataset.closing = String(!open);
    if (!open && element.open) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) element.close();
      else {
        timer = setTimeout(() => {
          element.close();
        }, 220);
      }
    }
    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  const containFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>(
      [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex="0"]'
      ].join(', ')
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <dialog
      ref={dialog}
      className={`${styles.drawer} ${className}`}
      aria-label={label}
      onClose={onDismiss}
      onKeyDown={containFocus}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss();
      }}
    >
      {children}
    </dialog>
  );
}
