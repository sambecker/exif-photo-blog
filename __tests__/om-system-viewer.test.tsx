import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import PhotoOmRecipe from '@/platforms/om-system/PhotoOmRecipe';
import { OmRecipe } from '@/platforms/om-system/recipe';
import { useAppState } from '@/app/AppState';
import OmRecipeSettings from '@/platforms/om-system/OmRecipeSettings';

jest.mock('../src/app/AppState', () => ({ useAppState: jest.fn() }));
jest.mock('../src/utility/useMediaQuery', () => ({
  __esModule: true, default: () => false,
}));
jest.mock('../src/app/path', () => ({
  pathForRecipe: (key: string) => `/recipe/${key}`,
}));
jest.mock('../src/components/entity/EntityLink', () => ({
  __esModule: true,
  default: ({ label, path, action }: {
    label: string, path: string, action: React.ReactNode
  }) => <span><a href={path}>{label}</a>{action}</span>,
}));

const recipe: OmRecipe = {
  version: 1, kind: 'color', colors: Array(12).fill(0),
  whiteBalance: { mode: 1, amber: 2, green: -3 },
  tone: { shadow: -4, mid: 0, highlight: 4 },
  shading: 3, sharpness: 0, contrast: 0,
};

it('keeps gallery navigation separate and restores page shortcuts on close',
  async () => {
    const setKeyboardCommands = jest.fn();
    jest.mocked(useAppState).mockReturnValue({
      setShouldRespondToKeyboardCommands: setKeyboardCommands,
    });
    render(<PhotoOmRecipe recipe={recipe} recipeKey="test-key"
      camera={{ make: 'OM Digital Solutions', model: 'PEN' }} />);
    expect(screen.getByRole('link', { name: 'Color recipe' })
      .getAttribute('href')).toBe('/recipe/test-key');
    const trigger = screen.getByRole('button', {
      name: 'Show color recipe settings',
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.querySelector('svg')?.classList.contains('rotate-45'))
      .toBe(false);
    fireEvent.click(trigger);
    const dialog = await screen.findByRole('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.querySelector('svg')?.classList.contains('rotate-45'))
      .toBe(true);
    expect(screen.getByText(
      'OM Digital Solutions PEN · Settings used for this photo',
    )).toBeDefined();
    expect(setKeyboardCommands).toHaveBeenLastCalledWith(false);
    expect(dialog.querySelectorAll('input')).toHaveLength(0);
    expect(screen.getByRole('img', {
      name: 'White balance shift A2 · M3',
    })).toBeDefined();
    expect(screen.getByRole('img', {
      name: 'Tone settings: shadows -4, midtones 0, highlights 4',
    })).toBeDefined();
    const pageKeydown = jest.fn();
    window.addEventListener('keydown', pageKeydown);
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(pageKeydown).not.toHaveBeenCalled();
    expect(setKeyboardCommands).toHaveBeenLastCalledWith(true);
    expect(trigger.querySelector('svg')?.classList.contains('rotate-45'))
      .toBe(false);
    await waitFor(() => expect(document.activeElement === trigger).toBe(true));
    window.removeEventListener('keydown', pageKeydown);
  });

it.each([
  { make: 'OM Digital Solutions   ', model: 'OM-3   ',
    label: 'OM-3' },
  { make: 'OLYMPUS IMAGING CORP.', model: 'PEN-F',
    label: 'OLYMPUS IMAGING CORP. PEN-F' },
  { make: 'OLYMPUS CORPORATION', model: 'E-P7',
    label: 'OLYMPUS CORPORATION E-P7' },
  { make: undefined, model: 'E-P7', label: 'E-P7' },
])('shows the source camera $label in the dialog', ({ make, model, label }) => {
  render(<PhotoOmRecipe recipe={recipe} recipeKey="test-key"
    camera={{ make, model }} />);
  fireEvent.click(screen.getByRole('button', {
    name: 'Show color recipe settings',
  }));
  expect(screen.getByText(`${label} · Settings used for this photo`))
    .toBeDefined();
});

it('omits a camera label when EXIF camera fields are missing', () => {
  render(<PhotoOmRecipe recipe={recipe} recipeKey="test-key" />);
  fireEvent.click(screen.getByRole('button', {
    name: 'Show color recipe settings',
  }));
  expect(screen.getByText('Settings used for this photo')).toBeDefined();
});

it('uses the modal on phones without also toggling the photo overlay', () => {
  const toggleRecipeOverlay = jest.fn();
  render(<PhotoOmRecipe recipe={recipe} recipeKey="test-key"
    toggleRecipeOverlay={toggleRecipeOverlay}
    isShowingRecipeOverlay={false} />);
  fireEvent.click(screen.getByRole('button', {
    name: 'Show color recipe settings',
  }));
  expect(screen.getByRole('dialog')).toBeDefined();
  expect(toggleRecipeOverlay).not.toHaveBeenCalled();
});

it('exposes the active mono filter strength in its accessible name', () => {
  render(<OmRecipeSettings recipe={{
    ...recipe, kind: 'mono', filter: { color: 1, strength: 3 },
    grain: 'low', hue: 'normal',
  }} />);
  expect(screen.getByRole('img', { name: 'Mono filter: Yellow · Level 3' }))
    .toBeDefined();
});

it('omits retained strength when the mono filter is inactive', () => {
  render(<OmRecipeSettings recipe={{
    ...recipe, kind: 'mono', filter: { color: 0, strength: 3 },
    grain: 'low', hue: 'normal',
  }} />);
  expect(screen.getByRole('img', { name: 'Mono filter: None' })).toBeDefined();
});
