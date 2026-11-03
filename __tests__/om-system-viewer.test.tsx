import '@testing-library/jest-dom';
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
const key = `om-v1-color-${'a'.repeat(64)}`;

it('keeps gallery navigation separate and restores page shortcuts on close',
  async () => {
    const setKeyboardCommands = jest.fn();
    jest.mocked(useAppState).mockReturnValue({
      setShouldRespondToKeyboardCommands: setKeyboardCommands,
    });
    render(<PhotoOmRecipe recipe={recipe} recipeKey={key} />);
    expect(screen.getByRole('link', { name: 'Color Recipe' })
      .getAttribute('href')).toBe(`/recipe/${key}`);
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
    expect(dialog).toHaveAccessibleName('Color Recipe');
    expect(setKeyboardCommands).toHaveBeenLastCalledWith(false);
    expect(dialog.querySelectorAll('input')).toHaveLength(0);
    fireEvent.click(screen.getByRole('tab', { name: 'White balance' }));
    expect(screen.getByRole('img', {
      name: 'White balance shift A2 · M3',
    })).toBeDefined();
    fireEvent.click(screen.getByRole('tab', { name: 'Tone' }));
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

it('renders settings as grid cells without panel headings', () => {
  render(<OmRecipeSettings recipe={recipe} />);
  expect(screen.queryByRole('heading')).toBeNull();
  expect(screen.getByText('Orange-red')).toBeDefined();
  fireEvent.click(screen.getByRole('tab', { name: 'White balance' }));
  expect(screen.getByText('A2 · M3')).toBeDefined();
  expect(screen.getByText('Shading')).toBeDefined();
});

it('uses the modal on phones without also toggling the photo overlay', () => {
  const toggleRecipeOverlay = jest.fn();
  render(<PhotoOmRecipe recipe={recipe} recipeKey={key}
    toggleRecipeOverlay={toggleRecipeOverlay}
    isShowingRecipeOverlay={false} />);
  fireEvent.click(screen.getByRole('button', {
    name: 'Show color recipe settings',
  }));
  expect(screen.getByRole('dialog')).toBeDefined();
  expect(toggleRecipeOverlay).not.toHaveBeenCalled();
});

it('labels custom-titled recipes by name', () => {
  render(<PhotoOmRecipe recipe={recipe} recipeKey="street-color" />);
  expect(screen.getByRole('link', { name: 'Street Color' })
    .getAttribute('href')).toBe('/recipe/street-color');
  fireEvent.click(screen.getByRole('button', {
    name: 'Show street color settings',
  }));
  expect(screen.getByRole('link', { name: 'Street Color' })).toBeDefined();
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

it('shows one panel and supports arrow, Home, and End keys on tabs', () => {
  render(<OmRecipeSettings recipe={recipe} />);
  const color = screen.getByRole('tab', { name: 'Color' });
  const tone = screen.getByRole('tab', { name: 'Tone' });
  const wb = screen.getByRole('tab', { name: 'White balance' });
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  expect(screen.getByRole('tabpanel', { name: 'Color' })).toBeVisible();
  expect(screen.queryByRole('img', {
    name: 'White balance shift A2 · M3',
  })).toBeNull();
  fireEvent.keyDown(color, { key: 'ArrowRight' });
  expect(tone).toHaveFocus();
  expect(tone).toHaveAttribute('aria-selected', 'true');
  expect(color).toHaveAttribute('tabindex', '-1');
  expect(screen.getByRole('tabpanel', { name: 'Tone' })).toBeVisible();
  fireEvent.keyDown(tone, { key: 'End' });
  expect(wb).toHaveFocus();
  expect(screen.getByRole('tabpanel', { name: 'White balance' })).toBeVisible();
  fireEvent.keyDown(wb, { key: 'ArrowRight' });
  expect(color).toHaveFocus();
  fireEvent.keyDown(color, { key: 'ArrowLeft' });
  expect(wb).toHaveFocus();
  fireEvent.keyDown(wb, { key: 'Home' });
  expect(color).toHaveFocus();
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
});
