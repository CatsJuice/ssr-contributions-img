import { themes } from 'src/utils/get-theme';

export const themesProcessor = () => {
  const themeCount = Object.keys(themes).length;
  const labelWidth = 100;
  const unit = 20;
  const padding = 20;
  const rowGap = 10;
  const colGap = 4;

  const maxLength = Object.keys(themes).reduce(
    (prev, curr) => Math.max(prev, themes[curr].length),
    0,
  );
  const width =
    padding * 3 + labelWidth + unit * maxLength + colGap * (maxLength - 1);
  const height = padding * 2 + unit * themeCount + rowGap * (themeCount - 1);

  const body = Object.keys(themes)
    .map((themeName, rowNum) => {
      const colors = themes[themeName];
      const y = padding + rowNum * (unit + rowGap);
      const text = `
            <text
              font-size="12px"
              dx="${padding}"
              dy="${y + 12}"
            >
              ${themeName}
            </text>`
        .trim()
        .replace(/\n/g, ' ');
      const nodes = colors
        .map((color, colNum) => {
          const x = padding + labelWidth + colNum * (unit + colGap);
          return `
              <rect
                x="${x}"
                y="${y}"
                width="${unit}"
                height="${unit}"
                fill="${color}"
                ry="4"
              />`
            .trim()
            .replace(/\n/g, ' ');
        })
        .join('\n');
      return `<g>${text}\n${nodes}</g>`;
    })
    .join('\n');

  const svg = `
        <svg
          width="${width}"
          height="${height}"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.1"
          baseProfile="full"
          viewBox="0 0 ${width} ${height}"
        >
          ${body}
        </svg>`;
  return svg;
};