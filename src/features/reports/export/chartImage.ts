export interface ChartImageOptions {
  chartId: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  pixelRatio?: number;
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 450;
const DEFAULT_PIXEL_RATIO = 2;
const LIGHT_THEME_COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
  '#06B6D4', '#84CC16', '#F97316', '#6366F1', '#14B8A6', '#EAB308',
];

function getChartContainer(chartId: string): HTMLElement | null {
  return document.querySelector(`[data-chart-id="${chartId}"] .recharts-wrapper`) as HTMLElement | null;
}

function getSvgElement(container: HTMLElement): SVGElement | null {
  return container.querySelector('svg');
}

function svgToCanvas(svg: SVGElement, width: number, height: number, backgroundColor: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(pixelRatio, pixelRatio);

  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const svgData = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG image'));
    };
    img.src = url;
  });
}

function forceLightThemeColors(svg: SVGElement): void {
  const style = document.createElement('style');
  style.textContent = `
    .recharts-text { fill: #1F2937 !important; }
    .recharts-legend-item-text { fill: #1F2937 !important; }
    .recharts-tooltip-wrapper { background: white !important; border: 1px solid #E5E7EB !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; }
    .recharts-tooltip-label { color: #1F2937 !important; }
    .recharts-tooltip-item { color: #1F2937 !important; }
    .recharts-cartesian-axis-tick-value { fill: #6B7280 !important; }
    .recharts-cartesian-grid line { stroke: #E5E7EB !important; }
    .recharts-polar-grid line { stroke: #E5E7EB !important; }
    .recharts-reference-line line { stroke: #9CA3AF !important; }
  `;
  svg.insertBefore(style, svg.firstChild);
}

export async function captureChartAsPng(options: ChartImageOptions): Promise<string> {
  const { chartId, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, backgroundColor = '#FFFFFF', pixelRatio = DEFAULT_PIXEL_RATIO } = options;

  const container = getChartContainer(chartId);
  if (!container) {
    throw new Error(`Chart container not found for id: ${chartId}`);
  }

  const svg = getSvgElement(container);
  if (!svg) {
    throw new Error(`SVG element not found in chart container: ${chartId}`);
  }

  forceLightThemeColors(svg);

  const canvas = await svgToCanvas(svg, width, height, backgroundColor);
  return canvas.toDataURL('image/png', 1.0).split(',')[1];
}

export async function captureAllCharts(chartIds: string[]): Promise<Record<string, string>> {
  const results: Record<string, string> = {};
  for (const id of chartIds) {
    try {
      results[id] = await captureChartAsPng({ chartId: id });
    } catch (error) {
      console.warn(`Failed to capture chart ${id}:`, error);
      results[id] = '';
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  return results;
}

export function applyLightThemeToRecharts(): void {
  const styleId = 'reports-light-theme-override';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .recharts-surface { background: white !important; }
    .recharts-text { fill: #1F2937 !important; }
    .recharts-legend-item-text { fill: #1F2937 !important; }
    .recharts-cartesian-axis-tick-value { fill: #6B7280 !important; }
    .recharts-cartesian-grid line { stroke: #E5E7EB !important; }
    .recharts-polar-grid line { stroke: #E5E7EB !important; }
    .recharts-reference-line line { stroke: #9CA3AF !important; }
    .recharts-tooltip-wrapper { background: white !important; border: 1px solid #E5E7EB !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important; }
    .recharts-tooltip-label { color: #1F2937 !important; }
    .recharts-tooltip-item { color: #1F2937 !important; }
    .recharts-dot { stroke: white !important; }
    .recharts-area { opacity: 0.3 !important; }
  `;
  document.head.appendChild(style);
}