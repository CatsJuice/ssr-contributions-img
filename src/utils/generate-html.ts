export const generateHtml = (body: string, title?: string, bg = '#fff') => {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body,html {
          width: 100%;
          height: 100%;
        }
        body {
          background-color: ${bg};
          display: flex;
          align-items: center;
          justify-content: center;
        }
      </style>
    </head>
    <body>
      ${body}
    </body>
    </html>`
    .trim()
    .replace(/\n/g, '');
};
