import { PixelCrop } from 'react-image-crop';

export const uploadPuzzleImage = async ({
  solution,
  image,
  canvas,
  crop,
  level,
  date,
}: {
  date: Date;
  image: HTMLImageElement;
  solution: string;
  canvas: HTMLCanvasElement;
  crop: PixelCrop;
  level: number;
}) => {
  if (!image || !canvas || !crop) {
    throw new Error('Crop canvas does not exist');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const offscreen = new OffscreenCanvas(
    crop.width * scaleX,
    crop.height * scaleY,
  );

  const ctx = offscreen.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  ctx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    offscreen.width,
    offscreen.height,
  );

  const blob = await offscreen.convertToBlob({
    type: 'image/jpeg',
    quality: 0.95,
  });

  const utcDate = new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    ),
  );

  // format date as YYYYMMDD
  const formattedDate = utcDate.toISOString().split('T')[0].replace(/-/g, '');

  const formData = new FormData();
  formData.append('file', blob, `${solution}-${level}.jpg`);
  formData.append('date', formattedDate);

  const response = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
};
