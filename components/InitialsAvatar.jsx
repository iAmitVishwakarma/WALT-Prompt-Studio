import React from 'react';
import { clsx } from 'clsx';

function nameToInitials(name = '', count = 2) {
  const parts = name.trim().split(/\s+/);
  if (!parts.length) return 'NN';
  if (parts.length === 1) return parts[0].slice(0, count).toUpperCase();
  return (parts[0][0] + parts[1][0]).slice(0, count).toUpperCase();
}

function stringToColor(str) {
  const palette = ['#6B46C1', '#FF6B6B', '#00A3FF', '#F6AD55', '#38B2AC', '#805AD5'];
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  const idx = Math.abs(h) % palette.length;
  return palette[idx];
}

export default function InitialsAvatar({ name, size = 64, className, fontSize }) {
  const initials = nameToInitials(name, 2);
  const bg = stringToColor(name || 'default');

  return (
    <div
      role="img"
      aria-label={name ? `${name} avatar` : 'user avatar'}
      className={clsx("flex items-center justify-center rounded-full text-white font-bold select-none", className)}
      style={{
        background: bg,
        width: size,
        height: size,
        fontSize: fontSize || Math.round(size / 2.2),
      }}
    >
      {initials}
    </div>
  );
}