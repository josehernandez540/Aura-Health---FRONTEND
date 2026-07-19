const CONTENT_DISPOSITION_FILENAME_REGEX = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i;

export const extractFilename = (contentDisposition: string | undefined, fallback: string): string => {
  if (!contentDisposition) return fallback;

  const match = contentDisposition.match(CONTENT_DISPOSITION_FILENAME_REGEX);
  if (!match) return fallback;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 10000);
};
