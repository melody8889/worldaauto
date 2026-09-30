import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const outDir = 'output/imagegen';
const outFile = `${outDir}/electric-trucks-studio.png`;

await mkdir(outDir, { recursive: true });

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1536" height="864" viewBox="0 0 1536 864" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="floorGlow" cx="47%" cy="70%" r="50%">
      <stop offset="0%" stop-color="#d7d9dc" stop-opacity="0.42"/>
      <stop offset="42%" stop-color="#53585d" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#111416" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="backdrop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#171b1f"/>
      <stop offset="47%" stop-color="#262b2f"/>
      <stop offset="100%" stop-color="#101315"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eef2f4"/>
      <stop offset="24%" stop-color="#879098"/>
      <stop offset="52%" stop-color="#283039"/>
      <stop offset="76%" stop-color="#aeb7bd"/>
      <stop offset="100%" stop-color="#2a3036"/>
    </linearGradient>
    <linearGradient id="cabBlue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f4f6f8"/>
      <stop offset="20%" stop-color="#aeb8c0"/>
      <stop offset="48%" stop-color="#4f5963"/>
      <stop offset="100%" stop-color="#161c22"/>
    </linearGradient>
    <linearGradient id="trailer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#dce2e4"/>
      <stop offset="22%" stop-color="#9aa4aa"/>
      <stop offset="55%" stop-color="#30363c"/>
      <stop offset="100%" stop-color="#15191d"/>
    </linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#cfe9f4" stop-opacity="0.82"/>
      <stop offset="48%" stop-color="#49626e" stop-opacity="0.72"/>
      <stop offset="100%" stop-color="#11191f" stop-opacity="0.86"/>
    </linearGradient>
    <radialGradient id="wheel" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#3b4147"/>
      <stop offset="40%" stop-color="#121519"/>
      <stop offset="100%" stop-color="#030405"/>
    </radialGradient>
    <filter id="softShadow" x="-30%" y="-40%" width="160%" height="190%">
      <feGaussianBlur stdDeviation="20"/>
    </filter>
    <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="19"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.055"/>
      </feComponentTransfer>
    </filter>
  </defs>

  <rect width="1536" height="864" fill="#eef1f3"/>
  <rect x="18" y="18" width="1500" height="828" rx="22" fill="url(#backdrop)"/>
  <path d="M18 430 C260 385 482 386 730 408 C1006 433 1242 398 1518 345 L1518 846 L18 846 Z" fill="#141719"/>
  <ellipse cx="732" cy="656" rx="620" ry="178" fill="url(#floorGlow)"/>
  <ellipse cx="770" cy="716" rx="630" ry="70" fill="#020304" opacity="0.44" filter="url(#softShadow)"/>

  <g transform="translate(194 194)">
    <ellipse cx="620" cy="504" rx="485" ry="44" fill="#030405" opacity="0.54" filter="url(#softShadow)"/>

    <g transform="skewY(-3)">
      <path d="M506 214 L1072 268 C1120 274 1156 312 1168 362 L1178 414 L472 385 Z" fill="url(#trailer)" stroke="#ccd3d7" stroke-opacity="0.24" stroke-width="3"/>
      <path d="M532 235 L1028 281 C1071 285 1101 310 1113 350 L1122 381 L535 356 Z" fill="#1b2025" opacity="0.55"/>
      <path d="M554 250 L1067 299" stroke="#e8eef2" stroke-opacity="0.24" stroke-width="3"/>
      <path d="M558 318 L1127 345" stroke="#060708" stroke-opacity="0.55" stroke-width="8"/>
      <path d="M560 372 L1162 397" stroke="#cfd6db" stroke-opacity="0.22" stroke-width="4"/>
    </g>

    <path d="M172 412 C222 287 292 228 382 210 L552 179 C620 169 673 196 705 252 L770 365 L757 432 L220 461 Z" fill="url(#cabBlue)" stroke="#d2d8dc" stroke-opacity="0.35" stroke-width="4"/>
    <path d="M207 399 C252 303 303 255 374 242 L485 224 C546 216 585 239 607 289 L643 373 L617 409 L227 434 Z" fill="#111820" opacity="0.52"/>
    <path d="M378 234 L477 220 C525 214 563 235 584 280 L606 330 L411 326 Z" fill="url(#glass)" stroke="#eaf4f8" stroke-opacity="0.33" stroke-width="4"/>
    <path d="M292 263 C327 244 359 237 393 235 L383 326 L253 344 C260 310 273 285 292 263 Z" fill="url(#glass)" stroke="#eaf4f8" stroke-opacity="0.3" stroke-width="4"/>
    <path d="M420 334 L610 339 L642 407 L395 421 Z" fill="#212a31" opacity="0.72"/>
    <path d="M178 415 L302 398 L362 435 L224 460 C199 456 182 441 178 415 Z" fill="#dde3e7" opacity="0.75"/>
    <path d="M206 413 L301 401" stroke="#101418" stroke-width="8" opacity="0.55"/>
    <path d="M621 312 L737 369 L754 423 L657 410 Z" fill="#56616b" opacity="0.72"/>
    <path d="M156 438 L235 423 L279 448 L196 468 C169 466 153 455 156 438 Z" fill="#cbd2d7"/>
    <path d="M188 448 L263 437" stroke="#3cf0ff" stroke-width="5" opacity="0.72" filter="url(#glow)"/>
    <path d="M646 402 L739 414" stroke="#3cf0ff" stroke-width="6" opacity="0.68" filter="url(#glow)"/>

    <path d="M293 460 L747 437 L1012 448 L1078 487 L312 522 Z" fill="url(#metal)" stroke="#cfd7dd" stroke-opacity="0.24" stroke-width="3"/>
    <path d="M408 454 L552 446 L561 491 L405 501 Z" fill="#1b2026" stroke="#9aa8af" stroke-opacity="0.22" stroke-width="3"/>
    <path d="M584 444 L711 440 L731 485 L594 493 Z" fill="#1b2026" stroke="#9aa8af" stroke-opacity="0.22" stroke-width="3"/>
    <path d="M756 445 L979 454" stroke="#dce6ea" stroke-opacity="0.26" stroke-width="5"/>
    <path d="M804 465 L1008 475" stroke="#030405" stroke-opacity="0.65" stroke-width="12"/>

    <g opacity="0.96">
      <circle cx="315" cy="505" r="83" fill="url(#wheel)"/>
      <circle cx="315" cy="505" r="55" fill="#11161b" stroke="#87929a" stroke-width="8"/>
      <circle cx="315" cy="505" r="22" fill="#b9c1c6"/>
      <path d="M315 452 L315 558 M262 505 L369 505 M279 469 L351 541 M351 469 L279 541" stroke="#c8d0d5" stroke-opacity="0.72" stroke-width="5"/>
    </g>
    <g opacity="0.93">
      <circle cx="815" cy="503" r="78" fill="url(#wheel)"/>
      <circle cx="815" cy="503" r="50" fill="#11161b" stroke="#87929a" stroke-width="8"/>
      <circle cx="815" cy="503" r="20" fill="#b9c1c6"/>
      <path d="M815 455 L815 551 M767 503 L864 503 M783 471 L847 535 M847 471 L783 535" stroke="#c8d0d5" stroke-opacity="0.67" stroke-width="5"/>
    </g>
    <g opacity="0.88">
      <circle cx="1004" cy="503" r="69" fill="url(#wheel)"/>
      <circle cx="1004" cy="503" r="44" fill="#11161b" stroke="#7d878f" stroke-width="7"/>
      <circle cx="1004" cy="503" r="17" fill="#b4bdc3"/>
      <path d="M1004 461 L1004 545 M962 503 L1047 503 M976 475 L1032 531 M1032 475 L976 531" stroke="#c7d0d6" stroke-opacity="0.62" stroke-width="4"/>
    </g>

    <path d="M452 420 C516 392 618 381 717 399" fill="none" stroke="#edf3f6" stroke-opacity="0.24" stroke-width="5"/>
    <path d="M244 374 C340 347 477 336 605 350" fill="none" stroke="#eef5f8" stroke-opacity="0.18" stroke-width="4"/>
    <path d="M748 432 L953 441" stroke="#44ecff" stroke-width="3" opacity="0.58" filter="url(#glow)"/>
    <path d="M300 231 C462 158 651 169 810 260" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="7"/>
  </g>

  <rect x="18" y="18" width="1500" height="828" rx="22" fill="none" stroke="#dbe2e6" stroke-opacity="0.55" stroke-width="2"/>
  <rect x="18" y="18" width="1500" height="828" rx="22" filter="url(#grain)" opacity="0.36"/>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(outFile);

console.log(outFile);
