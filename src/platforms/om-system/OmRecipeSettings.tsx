'use client';

import { useId, useRef, useState } from 'react';
import {
  formatOmWhiteBalance,
  formatOmWbShift,
  OM_COLOR_CHANNELS,
  OM_MONO_FILTERS,
  omSignedValue,
  OmRecipe,
} from './recipe';
import { clsx } from 'clsx/lite';
import RecipeGrid, { RecipeGridCell } from '@/recipe/RecipeGrid';

const COLORS = [
  '#e9e84a', '#edb243', '#ed7034', '#e33d3d', '#d83591', '#9939bf',
  '#405fe7', '#41a6e0', '#6edcdb', '#72d8a4', '#8ad54c', '#bfdf49',
];

const CHART_CLASS = 'mx-auto w-full max-w-56';

const point = (angle: number, radius: number, center = 120) => ({
  x: center + Math.cos(angle) * radius,
  y: center + Math.sin(angle) * radius,
});
const angleFor = (index: number, count = 12) =>
  -Math.PI / 2 + index * Math.PI * 2 / count;

function ColorWheel({ colors }: { colors: number[] }) {
  return (
    <svg viewBox="0 0 240 240" className={CHART_CLASS} role="img"
      aria-label="Twelve color adjustments">
      <circle cx="120" cy="120" r="40" fill="none"
        stroke="#0003" strokeDasharray="2 5" />
      <circle cx="120" cy="120" r="65" fill="none" stroke="#0003" />
      {COLORS.map((color, index) => {
        const a = point(angleFor(index), 94);
        const b = point(angleFor(index + 1), 94);
        return <line key={color} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
          stroke={color} strokeWidth="6" strokeLinecap="round" />;
      })}
      <polygon
        points={colors.map((value, i) => {
          const p = point(angleFor(i), 65 + value * 5);
          return `${p.x},${p.y}`;
        }).join(' ')}
        fill="#fff" fillOpacity="0.3" stroke="#0006" strokeWidth="1.5"
      />
      {colors.map((value, index) => {
        const p = point(angleFor(index), 65 + value * 5);
        const label = point(angleFor(index), 111);
        return <g key={OM_COLOR_CHANNELS[index]}>
          <circle cx={p.x} cy={p.y} r="4.5" fill={COLORS[index]} />
          <text x={label.x} y={label.y} textAnchor="middle"
            dominantBaseline="central" fill="#000c" fontSize="12">
            {omSignedValue(value)}
          </text>
        </g>;
      })}
    </svg>
  );
}

function MonoWheel({ recipe }: {
  recipe: Extract<OmRecipe, { kind: 'mono' }>
}) {
  const colors = ['#e9e84a', '#edb243', '#e33d3d', '#d83591',
    '#405fe7', '#6edcdb', '#8ad54c', '#bfdf49'];
  const selected = recipe.filter.color;
  const marker = point(angleFor(selected - 1, 8), 77);
  return (
    <svg viewBox="20 20 200 200" className={clsx(CHART_CLASS, 'grayscale')}
      role="img"
      aria-label={`Mono filter: ${OM_MONO_FILTERS[selected]}` +
        (selected === 0 ? '' : ` · Level ${recipe.filter.strength}`)}>
      {colors.map((color, i) => {
        const a = point(angleFor(i, 8) - Math.PI / 8, 73);
        const b = point(angleFor(i, 8) + Math.PI / 8, 73);
        return <path key={color}
          d={`M120 120 L${a.x} ${a.y} A73 73 0 0 1 ${b.x} ${b.y} Z`}
          fill={color} opacity={selected === i + 1 ? 1 : 0.65} />;
      })}
      <circle cx="120" cy="120" r="76" fill="none" stroke="#0006"
        strokeWidth="2" />
      {selected !== 0 && <>
        <line x1="120" y1="120" x2={marker.x} y2={marker.y}
          stroke="#000b" strokeWidth="3" />
        <circle cx={marker.x} cy={marker.y} r="5" fill="#000b" />
      </>}
    </svg>
  );
}

// A settings visualization, checked against the camera's neutral and S curves.
// Smooth monotone segments avoid overshoot; cells carry the exact settings.
const omTonePoints = ({ shadow, mid, highlight }: OmRecipe['tone']) => {
  const center = 0.5 + mid * 0.02;
  return [0,
    Math.max(0.01, Math.min(
      center - 0.02, 0.25 + shadow * 0.025 + mid * 0.01,
    )),
    center,
    Math.min(0.99, Math.max(
      center + 0.02, 0.75 + highlight * 0.025 + mid * 0.01,
    )),
    1];
};

function ToneGraph({ tone }: { tone: OmRecipe['tone'] }) {
  const ys = omTonePoints(tone);
  const slopes = ys.slice(1).map((y, i) => (y - ys[i]) * 4);
  const tangents = ys.map((_, i) =>
    i === 0 ? slopes[0] : i === 4 ? slopes[3] :
      2 * slopes[i - 1] * slopes[i] / (slopes[i - 1] + slopes[i]));
  const x = (value: number) => 16 + value * 208;
  const y = (value: number) => 224 - value * 208;
  const path = ys.slice(1).reduce((d, value, i) =>
    `${d} C${x(i / 4 + 1 / 12)} ${y(ys[i] + tangents[i] / 12)} ` +
    `${x((i + 1) / 4 - 1 / 12)} ${y(value - tangents[i + 1] / 12)} ` +
    `${x((i + 1) / 4)} ${y(value)}`, 'M16 224');
  return (
    <svg viewBox="0 0 240 240" className={CHART_CLASS} role="img"
      aria-label={`Tone settings: shadows ${tone.shadow}, ` +
        `midtones ${tone.mid}, highlights ${tone.highlight}`}>
      <path d="M16 16H224V224H16ZM120 16V224M16 120H224"
        fill="none" stroke="#0004" />
      <path d="M16 224L224 16" stroke="#0004" strokeWidth="1.5" />
      <path d={path} fill="none" stroke="#000c" strokeWidth="2.5" />
      {[1, 3].map(i => <path key={i}
        d={`M${x(i / 4) - 6} ${y(ys[i])}h12M${x(i / 4)} ${y(ys[i]) - 6}v12`}
        stroke="#000b" strokeWidth="2" />)}
    </svg>
  );
}

function WhiteBalanceShift({ whiteBalance }: {
  whiteBalance: OmRecipe['whiteBalance']
}) {
  return (
    <svg viewBox="0 0 240 220" className={CHART_CLASS} role="img"
      aria-label={`White balance shift ${formatOmWbShift(whiteBalance)}`}>
      <path d="M36 28H204" stroke="#83d889" strokeWidth="4" />
      <path d="M204 28V196" stroke="#edbf66" strokeWidth="4" />
      <path d="M36 196H204" stroke="#ce8bc9" strokeWidth="4" />
      <path d="M36 28V196" stroke="#7eaff1" strokeWidth="4" />
      <path d="M120 28V196M36 112H204" stroke="#0004" />
      {[['G', 120, 16], ['M', 120, 214], ['B', 20, 116], ['A', 221, 116]]
        .map(([label, x, y]) => <text key={label} x={x} y={y}
          textAnchor="middle" fill="#0008" fontSize="12">{label}</text>)}
      <circle cx={120 + whiteBalance.amber * 11}
        cy={112 - whiteBalance.green * 11} r="6" fill="#000c" />
    </svg>
  );
}

export default function OmRecipeSettings({ recipe }: { recipe: OmRecipe }) {
  const wb = recipe.whiteBalance;
  const id = useId();
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const labels = [recipe.kind === 'color' ? 'Color' : 'Mono', 'Tone',
    'White balance'];
  // Inactive panels stay in layout (invisible) so the tallest one
  // reserves the overlay height across tabs
  const panelProps = (index: number) => ({
    role: 'tabpanel',
    id: `${id}-panel-${index}`,
    'aria-labelledby': `${id}-tab-${index}`,
    'aria-hidden': selected !== index || undefined,
    inert: selected !== index || undefined,
    tabIndex: selected === index ? 0 : -1,
    className: clsx(
      'grid col-start-1 row-start-1',
      selected !== index && 'invisible',
    ),
  });
  return <div className="flex flex-col gap-2">
    <div role="tablist" aria-label="Recipe settings"
      className={clsx(
        'flex gap-1 p-0.5',
        'rounded-lg border border-neutral-200/40 bg-neutral-100/30',
      )}>
      {labels.map((label, index) => <button key={label}
        ref={node => { tabs.current[index] = node; }}
        id={`${id}-tab-${index}`} role="tab" type="button"
        aria-selected={selected === index}
        aria-controls={`${id}-panel-${index}`}
        tabIndex={selected === index ? 0 : -1}
        onClick={() => setSelected(index)}
        onKeyDown={event => {
          const next = event.key === 'ArrowRight' ? (index + 1) % labels.length
            : event.key === 'ArrowLeft'
              ? (index + labels.length - 1) % labels.length
              : event.key === 'Home' ? 0
                : event.key === 'End' ? labels.length - 1 : undefined;
          if (next !== undefined) {
            event.preventDefault();
            event.stopPropagation();
            setSelected(next);
            tabs.current[next]?.focus();
          }
        }}
        className={clsx(
          'min-h-7 rounded-md border-0 px-1.5 shadow-none',
          'text-[10px] font-medium uppercase tracking-wide whitespace-nowrap',
          'flex-1 basis-0 min-w-0 text-center',
          'inline-flex items-center justify-center',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          selected === index ? 'bg-white/80 text-black' :
            'bg-transparent text-black/50 hover:bg-white/40',
        )}>
        {label}
      </button>)}
    </div>
    <div className="grid">
      <section {...panelProps(0)}>
        {recipe.kind === 'color'
          ? <RecipeGrid className="grid-rows-[1fr_auto_auto_auto]">
            <RecipeGridCell span={12} isChart>
              <ColorWheel colors={recipe.colors} />
            </RecipeGridCell>
            {OM_COLOR_CHANNELS.map((channel, i) =>
              <RecipeGridCell key={channel} span={3} label={channel}>
                {omSignedValue(recipe.colors[i])}
              </RecipeGridCell>)}
          </RecipeGrid>
          : <RecipeGrid className="grid-rows-[1fr_auto_auto]">
            <RecipeGridCell span={12} isChart>
              <MonoWheel recipe={recipe} />
            </RecipeGridCell>
            <RecipeGridCell span={6} label="Filter">
              {OM_MONO_FILTERS[recipe.filter.color].toUpperCase()}
            </RecipeGridCell>
            <RecipeGridCell span={6} label="Level">
              {recipe.filter.color === 0 ? 'N/A' : recipe.filter.strength}
            </RecipeGridCell>
            <RecipeGridCell span={6} label="Film grain">
              {recipe.grain.toUpperCase()}
            </RecipeGridCell>
            <RecipeGridCell span={6} label="Film hue">
              {recipe.hue.toUpperCase()}
            </RecipeGridCell>
          </RecipeGrid>}
      </section>
      <section {...panelProps(1)}>
        <RecipeGrid className="grid-rows-[auto_1fr]">
          <RecipeGridCell label="Shadow">
            {omSignedValue(recipe.tone.shadow)}
          </RecipeGridCell>
          <RecipeGridCell label="Midtone">
            {omSignedValue(recipe.tone.mid)}
          </RecipeGridCell>
          <RecipeGridCell label="Highlight">
            {omSignedValue(recipe.tone.highlight)}
          </RecipeGridCell>
          <RecipeGridCell span={12} isChart>
            <ToneGraph tone={recipe.tone} />
          </RecipeGridCell>
        </RecipeGrid>
      </section>
      <section {...panelProps(2)}>
        <RecipeGrid className="grid-rows-[auto_1fr_auto]">
          <RecipeGridCell span={8} label={formatOmWbShift(wb)}>
            {formatOmWhiteBalance(wb).toUpperCase()}
          </RecipeGridCell>
          <RecipeGridCell label="Shading">
            {omSignedValue(recipe.shading)}
          </RecipeGridCell>
          <RecipeGridCell span={12} isChart>
            <WhiteBalanceShift whiteBalance={wb} />
          </RecipeGridCell>
          <RecipeGridCell span={6} label="Sharpness">
            {omSignedValue(recipe.sharpness)}
          </RecipeGridCell>
          <RecipeGridCell span={6} label="Contrast">
            {omSignedValue(recipe.contrast)}
          </RecipeGridCell>
        </RecipeGrid>
      </section>
    </div>
  </div>;
}
