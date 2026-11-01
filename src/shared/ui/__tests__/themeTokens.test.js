import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import tailwindConfig from '../../../../tailwind.config.js';

describe('Tailwind semantic theme tokens', () => {
  it('generates opacity-aware semantic and chart color utilities', async () => {
    const classes = [
      'bg-primary/50',
      'text-muted-foreground/75',
      'border-border/30',
      'bg-chart-1/20',
      'bg-chart-2/20',
      'bg-chart-3/20',
      'bg-chart-4/20',
      'bg-chart-5/20',
      'font-display',
    ].join(' ');
    const result = await postcss([
      tailwindcss({
        ...tailwindConfig,
        content: [{ raw: classes, extension: 'html' }],
      }),
    ]).process('@tailwind utilities;', { from: undefined });

    expect(result.css).toContain('rgb(var(--color-primary-rgb) / 0.5)');
    expect(result.css).toContain('rgb(var(--color-muted-foreground-rgb) / 0.75)');
    expect(result.css).toContain('rgb(var(--color-border-rgb) / 0.3)');
    for (let chart = 1; chart <= 5; chart += 1) {
      expect(result.css).toContain(`rgb(var(--color-chart-${chart}-rgb) / 0.2)`);
    }
    expect(result.css).toContain('.font-display');
  });
});
