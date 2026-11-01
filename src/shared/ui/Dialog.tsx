import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { cn } from '../lib/utils';
import { Portal } from './Portal';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  titleId: string;
  descriptionId: string;
  titlePresent: boolean;
  descriptionPresent: boolean;
  setTitlePresent: (present: boolean) => void;
  setDescriptionPresent: (present: boolean) => void;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialogContext = (): DialogContextValue => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('Dialog components must be used within <Dialog>.');
  return context;
};

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [titlePresent, setTitlePresent] = useState(false);
  const [descriptionPresent, setDescriptionPresent] = useState(false);
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const open = controlledOpen ?? uncontrolledOpen;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
      onOpenChange?.(nextOpen);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <DialogContext.Provider
      value={{
        open,
        onOpenChange: handleOpenChange,
        contentId: `dialog-content-${id}`,
        titleId: `dialog-title-${id}`,
        descriptionId: `dialog-description-${id}`,
        titlePresent,
        descriptionPresent,
        setTitlePresent,
        setDescriptionPresent,
        triggerRef,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};
Dialog.displayName = 'Dialog';

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, className, onClick, type = 'button', ...props }, forwardedRef) => {
    const context = useDialogContext();

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        context.triggerRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [context.triggerRef, forwardedRef],
    );

    return (
      <button
        ref={setRef}
        type={type}
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.open ? context.contentId : undefined}
        className={className}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.onOpenChange(true);
        }}
        {...props}
      >
        {children}
      </button>
    );
  },
);
DialogTrigger.displayName = 'DialogTrigger';

const focusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface DialogPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  dismissible?: boolean;
  variant?: 'dialog' | 'sheet';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

const DialogPanel = forwardRef<HTMLDivElement, DialogPanelProps>(
  (
    {
      children,
      className,
      dismissible = true,
      variant = 'dialog',
      side = 'right',
      onMouseDown,
      ...props
    },
    forwardedRef,
  ) => {
    const context = useDialogContext();
    const panelRef = useRef<HTMLDivElement | null>(null);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        panelRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    useEffect(() => {
      if (!context.open || !panelRef.current) return;

      const previouslyFocused = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : context.triggerRef.current;
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const focusable = panelRef.current.querySelector<HTMLElement>(
        '[autofocus], [data-autofocus], a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? panelRef.current).focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && dismissible) {
          event.preventDefault();
          context.onOpenChange(false);
          return;
        }
        if (event.key !== 'Tab' || !panelRef.current) return;

        const items = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
        ).filter((item) => !item.hasAttribute('hidden') && item.getAttribute('aria-hidden') !== 'true');
        const first = items[0];
        const last = items[items.length - 1];

        if (items.length === 0) {
          event.preventDefault();
          panelRef.current.focus();
        } else if (!panelRef.current.contains(document.activeElement)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = previousOverflow;
        if (previouslyFocused?.isConnected) previouslyFocused.focus();
        else context.triggerRef.current?.focus();
      };
    }, [context.open, context.onOpenChange, context.triggerRef, dismissible]);

    if (!context.open) return null;

    const isSheet = variant === 'sheet';
    const sheetPosition = {
      right: 'inset-y-0 right-0 h-dvh w-[min(24rem,calc(100vw-1rem))] border-l data-[state=open]:slide-in-from-right',
      left: 'inset-y-0 left-0 h-dvh w-[min(24rem,calc(100vw-1rem))] border-r data-[state=open]:slide-in-from-left',
      top: 'inset-x-0 top-0 h-[min(32rem,80dvh)] w-full border-b data-[state=open]:slide-in-from-top',
      bottom: 'inset-x-0 bottom-0 h-[min(32rem,80dvh)] w-full border-t data-[state=open]:slide-in-from-bottom',
    }[side];

    const {
      ['aria-label']: ariaLabel,
      ['aria-labelledby']: ariaLabelledBy,
      ['aria-describedby']: ariaDescribedBy,
      ...panelProps
    } = props;
    const labelledBy = ariaLabelledBy ?? (context.titlePresent ? context.titleId : undefined);
    const describedBy = ariaDescribedBy ??
      (context.descriptionPresent ? context.descriptionId : undefined);

    return (
      <Portal>
        <div
          data-testid="dialog-overlay"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]"
          aria-hidden="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && dismissible) context.onOpenChange(false);
          }}
        />
        <div
          {...panelProps}
          ref={setRef}
          id={context.contentId}
          role="dialog"
          aria-modal="true"
          aria-label={labelledBy ? undefined : (ariaLabel ?? 'Dialog')}
          aria-labelledby={labelledBy}
          aria-describedby={describedBy}
          tabIndex={-1}
          data-state="open"
          onMouseDown={(event) => {
            onMouseDown?.(event);
            if (event.defaultPrevented) return;
          }}
          className={cn(
            'z-50 overflow-y-auto border border-neutral-200 bg-white text-neutral-950 shadow-xl outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
            isSheet
              ? `fixed ${sheetPosition} animate-in duration-200`
              : 'fixed left-1/2 top-1/2 grid max-h-[min(90dvh,48rem)] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-2xl p-6 animate-in fade-in-0 zoom-in-95 duration-200',
            className,
          )}
        >
          {children}
        </div>
      </Portal>
    );
  },
);
DialogPanel.displayName = 'DialogContent';

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  dismissible?: boolean;
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>((props, ref) => (
  <DialogPanel {...props} ref={ref} />
));
DialogContent.displayName = 'DialogContent';

export const DialogClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ children, onClick, type = 'button', ...props }, ref) => {
    const context = useDialogContext();
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) context.onOpenChange(false);
        }}
      >
        {children}
      </button>
    );
  },
);
DialogClose.displayName = 'DialogClose';

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ children, ...props }, ref) => {
    const context = useDialogContext();
    useEffect(() => {
      context.setTitlePresent(true);
      return () => context.setTitlePresent(false);
    }, [context.setTitlePresent]);

    return (
      <h2
        {...props}
        ref={ref}
        id={context.titleId}
        className={cn('text-lg font-semibold leading-none tracking-tight', props.className)}
      >
        {children}
      </h2>
    );
  },
);
DialogTitle.displayName = 'DialogTitle';

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ children, ...props }, ref) => {
    const context = useDialogContext();
    useEffect(() => {
      context.setDescriptionPresent(true);
      return () => context.setDescriptionPresent(false);
    }, [context.setDescriptionPresent]);

    return (
      <p
        {...props}
        ref={ref}
        id={context.descriptionId}
        className={cn('text-sm text-neutral-500 dark:text-neutral-400', props.className)}
      >
        {children}
      </p>
    );
  },
);
DialogDescription.displayName = 'DialogDescription';

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-2 text-left', className)} {...props} />
  ),
);
DialogHeader.displayName = 'DialogHeader';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  ),
);
DialogFooter.displayName = 'DialogFooter';

export interface SheetContentProps extends DialogContentProps {
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const Sheet: React.FC<DialogProps> = Dialog;
Sheet.displayName = 'Sheet';
export const SheetTrigger = DialogTrigger;
export const SheetClose = DialogClose;
export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'right', ...props }, ref) => <DialogPanel {...props} ref={ref} variant="sheet" side={side} />,
);
SheetContent.displayName = 'SheetContent';
export const SheetHeader = DialogHeader;
export const SheetFooter = DialogFooter;
export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;
