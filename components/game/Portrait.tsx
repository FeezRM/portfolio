import { useId } from "react";
import { PortraitFace } from "./PortraitFace";

/** Original vector portrait, drawn from Faiz's supplied photos and creator footage. */
export function Portrait({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg
      className={className}
      viewBox="0 0 650 900"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${id}-shirt`}
          x1="205"
          y1="405"
          x2="556"
          y2="871"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#263f59" />
          <stop offset="0.48" stopColor="#101d35" />
          <stop offset="1" stopColor="#061329" />
        </linearGradient>
        <linearGradient
          id={`${id}-skin`}
          x1="285"
          y1="179"
          x2="471"
          y2="361"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#e0b18b" />
          <stop offset="0.55" stopColor="#c99572" />
          <stop offset="1" stopColor="#a36c55" />
        </linearGradient>
        <linearGradient
          id={`${id}-hair`}
          x1="266"
          y1="103"
          x2="505"
          y2="241"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#26303d" />
          <stop offset="0.55" stopColor="#151c29" />
          <stop offset="1" stopColor="#090f1d" />
        </linearGradient>
      </defs>
      {/* Short sleeves, warm forearms, a dark tee and the familiar phone silhouette. */}
      <path
        d="M154 890 189 606 162 466 260 398 321 368 455 380 549 479 597 890Z"
        fill={`url(#${id}-shirt)`}
      />
      <path
        d="m317 358 6-47 103-14 2 59 27 24c-22 46-90 73-143 6Z"
        fill={`url(#${id}-skin)`}
      />
      <path
        d="m320 360 9-25 94-12 3 29c-25 22-63 33-106 8Z"
        fill="#955e4f"
        fillOpacity="0.45"
      />
      <path d="M279 399c33 60 123 72 186-8" stroke="#080f20" strokeWidth="17" />
      <path d="M281 398c38 56 115 67 181-5" stroke="#38536b" strokeWidth="4" />
      <path
        d="m187 549-25 81 40 115 114 27 17-48-98-35 10-97Z"
        fill={`url(#${id}-skin)`}
      />
      <path
        d="m493 540 16 61-117 72 27 58 153-75-13-104Z"
        fill={`url(#${id}-skin)`}
      />
      <path d="m183 465 66 69-12 65-75-15-17-68Z" fill="#172c47" />
      <path d="m488 433 61 45 21 84-70 18-38-55Z" fill="#1c3350" />
      <path d="m167 579 67 16M500 569l61-15" stroke="#486177" strokeWidth="4" />
      <path
        d="m255 511-12 107M472 514l-22 122M211 817l-12 62"
        stroke="#23425f"
        strokeWidth="5"
      />
      <path
        d="M335 392c-7 41 0 99 46 112 45 5 65-60 63-109"
        stroke="#071525"
        strokeWidth="10"
      />
      <path
        d="M335 392c-7 41 0 99 46 112 45 5 65-60 63-109"
        stroke="#b9cccf"
        strokeWidth="6"
      />
      <path
        d="M335 392c-7 41 0 99 46 112 45 5 65-60 63-109"
        stroke="#f1f2df"
        strokeWidth="3"
        strokeDasharray="3 6"
      />
      <PortraitFace id={id} />
      <path d="m211 734 107 0 19 58-29 25-87-37Z" fill={`url(#${id}-skin)`} />
      <path
        d="m398 673-62-9-40 25 16 39 95 1 20-17Z"
        fill={`url(#${id}-skin)`}
      />
      <path
        d="m337 642 79-12 15 117-89 10Z"
        fill="#071846"
        stroke="#35f2ef"
        strokeWidth="3"
      />
      <path d="m350 651 55-8 7 46-56 8Z" fill="#35f2ef" />
      <path d="m252 833 118-98 161 38-12 117H225Z" fill="#071326" />
      <path
        d="m205 447 25 38m241 153-20 13m-232 182-7 40"
        stroke="#35f2ef"
        strokeOpacity="0.65"
        strokeWidth="3"
      />
    </svg>
  );
}
