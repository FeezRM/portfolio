/** A single aligned facial plane keeps eyes, frames and jaw in consistent perspective. */
export function PortraitFace({ id }: { id: string }) {
  const face =
    "M274 181C281 126 324 102 388 102c65 0 108 30 114 80l-4 74c-4 31-21 54-43 75-20 18-40 28-67 29-27-1-47-11-67-29-22-21-39-44-43-75Z";
  return (
    <g transform="rotate(-3 388 235)">
      <defs>
        <clipPath id={`${id}-face`}>
          <path d={face} />
        </clipPath>
      </defs>
      <path
        d="M278 215c-21-16-34 2-29 23 3 23 15 37 31 35m218-58c21-16 34 2 29 23-3 23-15 37-31 35"
        fill="#bc8869"
      />
      <path d={face} fill={`url(#${id}-skin)`} />
      <g clipPath={`url(#${id}-face)`}>
        <path
          d="M485 188c19 63 5 100-38 142-18 17-31 25-59 30 59 2 111-47 119-102Z"
          fill="#a7795b"
          fillOpacity="0.2"
        />
        <path
          d="M296 269c15 10 29 10 44 3m96 0c15 7 29 7 44-3"
          stroke="#dba07f"
          strokeOpacity="0.5"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {[326, 450].map((cx) => (
          <g key={cx}>
            <path
              d={`M${cx - 29} 242q29-19 58 0q-29 18-58 0Z`}
              fill="#eee5d3"
            />
            <ellipse cx={cx} cy="242" rx="9" ry="10" fill="#49372a" />
            <ellipse cx={cx} cy="243" rx="4" ry="6" fill="#211d19" />
            <circle cx={cx - 3} cy="239" r="2.3" fill="#f3f6ea" />
            <path
              d={`M${cx - 29} 242q29-19 58 0`}
              stroke="#765543"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d={`M${cx - 30} 220q29-14 59-1`}
              stroke="#302b25"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        ))}
        <path
          d="M387 247c-2 13-6 27-11 38 5 6 15 7 22 2"
          stroke="#ae7c5d"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M376 289q6-3 11-1m6 0 7-1"
          stroke="#956951"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M362 306c10-5 18-6 26-3 9-3 18-2 27 3l-2 4c-10-2-18-4-25-2-8-2-17 0-24 2Z"
          fill="#49352a"
        />
        <path d="M365 319q23 14 46-1-21-3-46 1Z" fill="#ae7767" />
        <path
          d="M365 318q22 3 46-1"
          stroke="#7b5549"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M383 333q5 3 11 0l-2 8h-7Z" fill="#48372c" />
        <path
          d="M365 343c9 5 14 9 23 9 10 0 17-5 25-10l-3 9c-7 7-14 10-22 10-10 0-18-4-23-10Z"
          fill="#3e3129"
        />
        <path
          d="m355 331 2 4m64-5-2 4m-56 3 2 4m49-4-2 4"
          stroke="#79553f"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      {/* Matched lenses follow the same eye line; highlights stay subtle. */}
      {[326, 450].map((cx) => (
        <g key={cx}>
          <path
            d={`M${cx - 45} 228q0-11 16-13h58q16 2 16 13l-4 30q-5 22-41 22-36 0-41-22Z`}
            fill="#b4e0e1"
            fillOpacity="0.06"
            stroke="#c4cbc7"
            strokeWidth="3.5"
          />
          <path
            d={`M${cx - 45} 229q0-14 45-14t45 14`}
            stroke="#1c2631"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d={`m${cx - 31} 231 8 27`}
            stroke="#eef7ef"
            strokeOpacity="0.25"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path d="M371 233q17-9 34 0" stroke="#bac5c4" strokeWidth="3.5" />
      <path
        d="m281 229-21 3M495 229l20 3"
        stroke="#1c2631"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M253 251c-6-9-2-18 5-17 8 1 9 10 4 16l-1 24c-1 6-7 6-9 0Z"
        fill="#eff2eb"
      />
      <path
        d="M518 251c-6-9-2-18 5-17 8 1 9 10 4 16l-1 24c-1 6-7 6-9 0Z"
        fill="#eff2eb"
      />
      <path
        d="M272 235c-21-25-30-53-17-80l-9-10 21-17-2-14 30-10 3-14 33 1 16-18 28 9 24-11 28 12 22-1 19 19 23 5 12 24 17 18-2 23 12 23-11 30-13 24-7-32-17-25-21 9-11-20-24 11-14-16-21 15-13-12-24 17-17-7-16 25-17-4Z"
        fill={`url(#${id}-hair)`}
      />
      <path
        d="M266 158c25-29 55-43 83-43m-54 62c21-29 51-42 82-41m-32 45c27-26 54-28 78-18m-17-45c29 7 49 24 62 48"
        stroke="#39434e"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="m278 121 15-5m61-28 17 3m77 20 10 9"
        stroke="#53778d"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}
