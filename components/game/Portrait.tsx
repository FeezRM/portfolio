import { useId } from "react";

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
      {/* Tapered jaw and fuller, irregular hair replace the generic protagonist's face. */}
      <path
        d="M269 206c-24-21-37 8-28 40 4 20 18 36 36 28m228-56c20-12 34 9 26 35-6 18-14 29-31 29"
        fill="#b37d60"
      />
      <path
        d="M263 189c9-53 56-89 118-91 77-5 127 37 134 101l-12 75c-10 42-48 83-101 91-45-8-88-35-111-74Z"
        fill={`url(#${id}-skin)`}
      />
      <path
        d="m488 220 15 19-10 41c-14 35-40 60-83 73l-8 12c53-8 91-49 101-91l12-75Z"
        fill="#986550"
        fillOpacity="0.3"
      />
      <path
        d="M288 252c14-14 36-19 57-4-16 11-36 12-54 6m127-9c20-14 44-16 65-5-16 13-38 18-61 11"
        fill="#ede2ca"
      />
      <ellipse cx="317" cy="248" rx="11" ry="10" fill="#382a21" />
      <ellipse cx="446" cy="244" rx="11" ry="10" fill="#382a21" />
      <circle cx="321" cy="245" r="3" fill="#e8f6ed" />
      <circle cx="450" cy="240" r="3" fill="#e8f6ed" />
      <path
        d="M284 219c16-12 42-14 63-2m74-4c21-11 45-12 64-3"
        stroke="#302925"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="m382 245-11 44 22 7 12-9"
        stroke="#a27056"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M371 289c8-6 20-6 27-1"
        stroke="#805646"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M354 309c13-10 23-7 30-5 10-5 23-5 36 2l-5 7c-17-4-25-4-31-1-9-3-16-2-28 4Z"
        fill="#3a2b25"
      />
      <path d="M358 319c18-1 33 0 53-4-12 16-32 20-51 12Z" fill="#a66c61" />
      <path
        d="M360 320c17 3 32 0 47-2"
        stroke="#734b43"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="m381 335 14-3-3 12-8 2Z" fill="#382b25" />
      <path
        d="M355 340c9 5 14 15 30 17 17 2 31-9 44-22l-2 13c-8 14-24 22-40 21-17-2-30-10-34-19Z"
        fill="#302825"
      />
      <path
        d="m349 300-2 9m83-10 2 8m-76 25-1 7m73-8-2 8"
        stroke="#765343"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Clear lenses, dark browline frames, silver lower rims and a narrow bridge. */}
      <path
        d="M275 231c1-8 10-13 25-15l41-1c19 1 27 7 28 18l-2 30c-5 19-20 26-40 27-25 0-43-9-47-29Zm126-6c2-9 14-15 32-17l42-1c19 0 27 6 28 17l-5 29c-5 18-21 25-42 27-26 1-44-7-48-24Z"
        fill="#82c8da"
        fillOpacity="0.08"
        stroke="#bfc9c8"
        strokeWidth="4"
      />
      <path
        d="M274 232c4-14 19-20 45-20 26-1 43 2 51 16m31-3c4-14 22-20 48-20 27-1 45 2 53 13"
        stroke="#17222f"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path d="M370 235c8-8 19-10 31-3" stroke="#c5ccca" strokeWidth="4" />
      <path
        d="m276 230-22 4m248-15 15 13"
        stroke="#15222f"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="m292 233 10 34m118-42 11 34"
        stroke="#def5f2"
        strokeOpacity="0.45"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M248 265c-8-9-4-21 5-21 9 1 10 10 5 17l-1 23c-1 7-8 8-10 2Z"
        fill="#eff4ee"
      />
      <path
        d="M521 252c-7-8-4-20 5-20 9 1 11 11 6 18l-1 23c-1 7-8 8-10 2Z"
        fill="#eff4ee"
      />
      <path
        d="m248 277 1 8m273-19 1 8"
        stroke="#a9c6ca"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M249 231c-15-20-17-39-11-60l-11-5 19-22-7-12 29-16-4-15 33-9-1-15 42 1 17-18 40 12 25-10 31 23 35 1 11 29 27 14-2 32 17 23-10 43-17 22-4-35-23-22-22 13-13-23-25 13-9-24-27 19-15-14-18 22-19-5-12 25-17-4-8 37Z"
        fill={`url(#${id}-hair)`}
      />
      <path
        d="M258 168c24-36 58-56 99-61m-68 80c25-35 55-48 83-49m-26 41c28-34 57-37 85-25m-23-39c35 3 60 25 70 52m-34 4 30 34"
        stroke="#364555"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="m258 128 20-10m67-38 21 5m87 18 13 13"
        stroke="#537c94"
        strokeOpacity="0.65"
        strokeWidth="3"
        strokeLinecap="round"
      />
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
