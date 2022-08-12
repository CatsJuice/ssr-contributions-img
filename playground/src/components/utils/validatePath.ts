export const validatePath = (inputPath: string) => {
  const path = inputPath.charAt(0) !== '/' ? '/' + inputPath : inputPath;
  return path.replace(/\/{2,}/g, '/');
};
