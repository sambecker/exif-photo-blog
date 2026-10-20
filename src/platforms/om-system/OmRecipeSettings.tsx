import {
  formatOmWhiteBalance,
  formatOmWbShift,
  OM_COLOR_CHANNELS,
  OM_MONO_FILTERS,
  omSignedValue,
  OmRecipe,
} from './recipe';
import { clsx } from 'clsx/lite';

const COLORS = [
  '#e9e84a', '#edb243', '#ed7034', '#e33d3d', '#d83591', '#9939bf',
  '#405fe7', '#41a6e0', '#6edcdb', '#72d8a4', '#8ad54c', '#bfdf49',
];

const point = (angle: number, radius: number, center = 120) => ({
  x: center + Math.cos(angle) * radius,
  y: center + Math.sin(angle) * radius,
});
const angleFor = (index: number, count = 12) =>
  -Math.PI / 2 + index * Math.PI * 2 / count;

function ColorWheel({ colors }: { colors: number[] }) {
  return <>
    <svg viewBox="0 0 240 240" className="w-full" role="img"
      aria-label="Twelve color adjustments">
      <circle cx="120" cy="120" r="40" fill="none"
        stroke="#888" strokeDasharray="2 5" />
      <circle cx="120" cy="120" r="65" fill="none" stroke="#888" />
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
        fill="#fff" fillOpacity="0.25" stroke="#eee" strokeWidth="1.5"
      />
      {colors.map((value, index) => {
        const p = point(angleFor(index), 65 + value * 5);
        const label = point(angleFor(index), 111);
        return <g key={OM_COLOR_CHANNELS[index]}>
          <circle cx={p.x} cy={p.y} r="4.5" fill={COLORS[index]} />
          <text x={label.x} y={label.y} textAnchor="middle"
            dominantBaseline="central" fill="#fafafa" fontSize="12">
            {omSignedValue(value)}
          </text>
        </g>;
      })}
    </svg>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
      {OM_COLOR_CHANNELS.map((label, i) => <div key={label}
        className="flex justify-between gap-2">
        <dt className="text-neutral-300">{label}</dt>
        <dd>{omSignedValue(colors[i])}</dd>
      </div>)}
    </dl>
  </>;
}

function MonoWheel({ recipe }: {
  recipe: Extract<OmRecipe, { kind: 'mono' }>
}) {
  const colors = ['#e9e84a', '#edb243', '#e33d3d', '#d83591',
    '#405fe7', '#6edcdb', '#8ad54c', '#bfdf49'];
  const selected = recipe.filter.color;
  const marker = point(angleFor(selected - 1, 8), 77);
  return <>
    <svg viewBox="0 0 240 240" className="w-full" role="img"
      aria-label={`Mono filter: ${OM_MONO_FILTERS[selected]}`}>
      {colors.map((color, i) => {
        const a = point(angleFor(i, 8) - Math.PI / 8, 73);
        const b = point(angleFor(i, 8) + Math.PI / 8, 73);
        return <path key={color}
          d={`M120 120 L${a.x} ${a.y} A73 73 0 0 1 ${b.x} ${b.y} Z`}
          fill={color} opacity={selected === i + 1 ? 1 : 0.65} />;
      })}
      <circle cx="120" cy="120" r="76" fill="none" stroke="#eee"
        strokeWidth="2" />
      {selected !== 0 && <>
        <line x1="120" y1="120" x2={marker.x} y2={marker.y}
          stroke="white" strokeWidth="3" />
        <circle cx={marker.x} cy={marker.y} r="5" fill="white" />
      </>}
      <text x="120" y="222" textAnchor="middle" fill="#fafafa" fontSize="14">
        {selected === 0 ? 'No filter' :
          `${OM_MONO_FILTERS[selected]} · Level ${recipe.filter.strength}`}
      </text>
    </svg>
    <dl className="space-y-3 text-sm">
      <div><dt className="text-xs text-neutral-400">Film grain</dt>
        <dd className="capitalize">{recipe.grain}</dd></div>
      <div><dt className="text-xs text-neutral-400">Film hue</dt>
        <dd className="capitalize">{recipe.hue}</dd></div>
    </dl>
  </>;
}

// A settings visualization, checked against the camera's neutral and S curves.
// Smooth monotone segments avoid overshoot; labels carry the exact settings.
export const omTonePoints = ({ shadow, mid, highlight }: OmRecipe['tone']) => {
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
  const description = `Tone settings: shadows ${tone.shadow}, ` +
    `midtones ${tone.mid}, highlights ${tone.highlight}`;
  return <>
    <dl className="flex justify-between gap-2 text-sm">
      {(['shadow', 'mid', 'highlight'] as const).map((key, i) =>
        <div key={key} className="flex gap-1">
          <dt>{['Sh', 'Mid', 'Hi'][i]}</dt>
          <dd>{omSignedValue(tone[key])}</dd>
        </div>)}
    </dl>
    <svg viewBox="0 0 240 240" className="w-full" role="img"
      aria-label={description}>
      <path d="M16 16H224V224H16ZM120 16V224M16 120H224"
        fill="none" stroke="#999" />
      <path d="M16 224L224 16" stroke="#999" strokeWidth="1.5" />
      <path d={path} fill="none" stroke="#fafafa" strokeWidth="2.5" />
      {[1, 3].map(i => <path key={i}
        d={`M${x(i / 4) - 6} ${y(ys[i])}h12M${x(i / 4)} ${y(ys[i]) - 6}v12`}
        stroke="white" strokeWidth="2" />)}
    </svg>
    <p className="text-xs text-neutral-400">Shadow · Midtone · Highlight</p>
  </>;
}

function Setting({ label, value, limit = 5 }: {
  label: string, value: number, limit?: number
}) {
  return <div className="space-y-1.5">
    <div className="flex justify-between gap-3 text-sm">
      <dt>{label}</dt><dd>{omSignedValue(value)}</dd>
    </div>
    <div className="relative h-1 rounded bg-neutral-600" aria-hidden="true">
      <span className={clsx(
        'absolute top-[-3px] size-2.5 -translate-x-1/2',
        'rounded-full bg-neutral-200',
      )}
      style={{ left: `${10 + (value + limit) / (limit * 2) * 80}%` }} />
    </div>
  </div>;
}

export default function OmRecipeSettings({ recipe }: { recipe: OmRecipe }) {
  const wb = recipe.whiteBalance;
  const panelClass = 'rounded-lg bg-neutral-800 p-4 text-neutral-50';
  return <div className="grid gap-4 md:grid-cols-3">
    <section className={panelClass} aria-label={recipe.kind === 'color'
      ? 'Color adjustments' : 'Mono settings'}>
      <h3 className="text-sm font-medium">
        {recipe.kind === 'color' ? 'Color adjustments' : 'Mono settings'}
      </h3>
      {recipe.kind === 'color'
        ? <ColorWheel colors={recipe.colors} />
        : <MonoWheel recipe={recipe} />}
    </section>
    <section className={panelClass} aria-label="Tone settings">
      <h3 className="mb-4 text-sm font-medium">Tone settings</h3>
      <ToneGraph tone={recipe.tone} />
    </section>
    <section className={panelClass} aria-label="White balance and detail">
      <h3 className="text-sm font-medium">White balance</h3>
      <p className="mt-2 text-xs">{formatOmWhiteBalance(wb)}</p>
      <p className="mt-1 text-xs text-neutral-300">{formatOmWbShift(wb)}</p>
      <svg viewBox="0 0 240 220" className="w-full" role="img"
        aria-label={`White balance shift ${formatOmWbShift(wb)}`}>
        <path d="M36 28H204" stroke="#83d889" strokeWidth="4" />
        <path d="M204 28V196" stroke="#edbf66" strokeWidth="4" />
        <path d="M36 196H204" stroke="#ce8bc9" strokeWidth="4" />
        <path d="M36 28V196" stroke="#7eaff1" strokeWidth="4" />
        <path d="M120 28V196M36 112H204" stroke="#999" />
        {[['G', 120, 16], ['M', 120, 214], ['B', 20, 116], ['A', 221, 116]]
          .map(([label, x, y]) => <text key={label} x={x} y={y}
            textAnchor="middle" fill="#eee" fontSize="12">{label}</text>)}
        <circle cx={120 + wb.amber * 11} cy={112 - wb.green * 11}
          r="6" fill="#fafafa" />
      </svg>
      <dl className="space-y-5">
        <Setting label="Shading effect" value={recipe.shading} />
        <Setting label="Sharpness" value={recipe.sharpness} limit={2} />
        <Setting label="Contrast" value={recipe.contrast} limit={2} />
      </dl>
    </section>
  </div>;
}
