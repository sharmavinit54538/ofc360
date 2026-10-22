import React, { useId } from 'react';

export interface GeminiIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  useGradient?: boolean;
}

/**
 * Enterprise Google Gemini Sparkle Icon with signature multi-stop gradient.
 * Features the iconic 4-pointed astroid spark and secondary companion twinkle.
 */
export const GeminiIcon: React.FC<GeminiIconProps> = ({
  className = 'w-4 h-4',
  size,
  useGradient = true,
  style,
  ...props
}) => {
  const rawId = useId();
  // Safe ID without colons for SVG defs
  const gradientId = `gemini-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
      {...props}
    >
      {useGradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4E95FF" />
            <stop offset="35%" stopColor="#7E68FF" />
            <stop offset="70%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      )}

      {/* Main 4-pointed Gemini Sparkle */}
      <path
        d="M12 2C12 7.52285 16.4772 12 22 12C16.4772 12 12 16.4772 12 22C12 16.4772 7.52285 12 2 12C7.52285 12 12 7.52285 12 2Z"
        fill={useGradient ? `url(#${gradientId})` : 'currentColor'}
      />

      {/* Secondary companion Sparkle (characteristic of Google Gemini) */}
      <path
        d="M19 1.5C19 3.433 20.567 5 22.5 5C20.567 5 19 6.567 19 8.5C19 6.567 17.433 5 15.5 5C17.433 5 19 3.433 19 1.5Z"
        fill={useGradient ? `url(#${gradientId})` : 'currentColor'}
        opacity={0.88}
      />
    </svg>
  );
};

export default GeminiIcon;
