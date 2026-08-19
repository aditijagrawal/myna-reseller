export function SendIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_1316_46067" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <rect width="20" height="20" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_1316_46067)">
        <path
          d="M16.6028 10.6154L5.57564 14.9983C5.35236 15.0849 5.1451 15.0633 4.95387 14.9334C4.76262 14.8036 4.66699 14.6228 4.66699 14.391V5.60901C4.66699 5.37716 4.76262 5.19633 4.95387 5.06653C5.1451 4.93672 5.35236 4.91509 5.57564 5.00163L16.6028 9.38461C16.8848 9.49359 17.0259 9.69871 17.0259 9.99999C17.0259 10.3013 16.8848 10.5064 16.6028 10.6154ZM5.7503 13.7708L15.2086 9.99999L5.7503 6.22915V8.66026L9.76949 9.99999L5.7503 11.3397V13.7708Z"
          fill={color}
        />
      </g>
    </svg>
  )
}
