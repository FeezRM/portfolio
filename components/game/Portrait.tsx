export function Portrait({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 650 900"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="portrait-jacket"
          x1="140"
          y1="300"
          x2="560"
          y2="850"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#133dea" />
          <stop offset="1" stopColor="#061b67" />
        </linearGradient>
        <linearGradient
          id="portrait-face"
          x1="330"
          y1="160"
          x2="480"
          y2="360"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#f3fcff" />
          <stop offset="1" stopColor="#a9d6f3" />
        </linearGradient>
      </defs>
      <path
        d="M148 890 192 558 160 459 256 385 331 357 468 390 551 510 602 890Z"
        fill="url(#portrait-jacket)"
      />
      <path d="m315 349 9-66 98-8 5 83 41 32-64 123-98-103Z" fill="#a9d6f3" />
      <path d="m305 366 35 35 72-26 37 33-40 151-103-125Z" fill="#f5fbff" />
      <path d="m355 403 25-3 20 30-24 114-23-10-5-99Z" fill="#071846" />
      <path d="m318 354-55 38 39 163 36-31-29-75 29-33Z" fill="#2d61ff" />
      <path d="m423 350 42 49-57 165-24-31 25-99-29-28Z" fill="#315eff" />
      <path
        d="m251 180 46-77 115-25 103 68 9 105-37 76-88 40-62-46-61-52Z"
        fill="url(#portrait-face)"
      />
      <path d="m291 247 57 8-28 20-23-3Z" fill="#071846" />
      <path d="m427 242 60-12-22 30-40 1Z" fill="#071846" />
      <path d="m309 255 25 3-13 9-13-1Z" fill="#35f2ef" />
      <path d="m436 247 31-9-12 14-20 2Z" fill="#35f2ef" />
      <path
        d="m397 259-13 34 25-7M373 323l40-10"
        stroke="#568abc"
        strokeWidth="4"
      />
      <path
        d="m242 230-8-76 57-74 105-36 98 34 60 77-34 95-29-50-14-60-31 91-33-51-31 70-11-87-48 83-21-52-12 49-27-29Z"
        fill="#071846"
      />
      <path d="m253 167 58-74 90-31-63 61-8 63-18-48-26 48Z" fill="#244bd2" />
      <path d="m436 83 46 40 23 69-35-29-5-46Z" fill="#2849c9" />
      <path
        d="M243 219c-4-105 50-172 130-172 79 0 139 55 145 130"
        stroke="#35f2ef"
        strokeWidth="13"
      />
      <path
        d="m246 204-25 3-12 68 27 20 25-9 5-56Z"
        fill="#061b67"
        stroke="#35f2ef"
        strokeWidth="7"
      />
      <path
        d="m507 194 24-4 19 63-19 26-28-3-13-51Z"
        fill="#061b67"
        stroke="#35f2ef"
        strokeWidth="7"
      />
      <path
        d="m182 492 62 70-42 154 93 43-32 66-117-48-25-67Z"
        fill="#0a257d"
      />
      <path d="m202 716 113 14 22 62-28 24-89-35Z" fill="url(#portrait-face)" />
      <path d="m479 460 81 40 12 157-155 75-26-60 111-78Z" fill="#1646d9" />
      <path
        d="m397 674-62-8-38 24 15 38 95 1 20-17Z"
        fill="url(#portrait-face)"
      />
      <path
        d="m337 642 79-12 15 117-89 10Z"
        fill="#071846"
        stroke="#35f2ef"
        strokeWidth="3"
      />
      <path d="m350 651 55-8 7 46-56 8Z" fill="#35f2ef" />
      <path d="m252 833 118-98 161 38-12 117H225Z" fill="#071846" />
      <path
        d="m204 446 30 48M447 488l-13 51M464 596l-21 46M215 818l-18 62"
        stroke="#35f2ef"
        strokeWidth="4"
      />
      <path d="m509 483 33 9-1 32-32-8Z" fill="#f5fbff" />
      <path d="m514 489 19 5-1 17-19-4Z" fill="#143ded" />
    </svg>
  );
}
