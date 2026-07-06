/** Clone a table container and capture as PNG (optionally drop marked columns). */
export async function captureTableElementAsPng(
  source: HTMLElement,
  filename: string,
  options?: { excludeSelector?: string },
): Promise<void> {
  const clone = source.cloneNode(true) as HTMLElement;
  if (options?.excludeSelector) {
    clone.querySelectorAll(options.excludeSelector).forEach((node) => node.remove());
  }

  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-10000px';
  wrapper.style.top = '0';
  wrapper.style.background = '#ffffff';
  wrapper.style.padding = '12px';
  wrapper.style.zIndex = '-1';
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  try {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(wrapper, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } finally {
    document.body.removeChild(wrapper);
  }
}
