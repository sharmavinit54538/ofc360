import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const portalRootRef = useRef<HTMLDivElement | null>(null);
  const targetContainer = container || document.body;

  useEffect(() => {
    if (!portalRootRef.current) {
      portalRootRef.current = document.createElement('div');
      targetContainer.appendChild(portalRootRef.current);
    }
    return () => {
      if (portalRootRef.current && portalRootRef.current.parentNode) {
        portalRootRef.current.parentNode.removeChild(portalRootRef.current);
      }
    };
  }, [targetContainer]);

  if (!portalRootRef.current) return null;

  return createPortal(children, portalRootRef.current);
};

export default Portal;