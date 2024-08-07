import React, { useEffect } from 'react';
import { cropFractionGenerator } from '@/utils/cropFractionGenerator';
import { PixelCrop } from 'react-image-crop';
import { canvasPreview } from '@/utils/canvasPreview';

const LEVELS = 6;

export const useGenerateCrops = ({
  ramp,
  rate,
  completedCrop,
  setCrops,
  imgRef,
  previewCanvasesRef,
}: {
  ramp: number;
  rate: number;
  completedCrop?: PixelCrop;
  setCrops: (crops: PixelCrop[]) => void;
  imgRef: React.MutableRefObject<HTMLImageElement | null>;
  previewCanvasesRef: React.MutableRefObject<HTMLCanvasElement[]>;
}) => {
  useEffect(() => {
    const generatedCrops = cropFractionGenerator(LEVELS + 1, ramp, rate).map(
      (fraction, i) => {
        if (!completedCrop)
          return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            unit: 'px' as PixelCrop['unit'],
          };

        const imgWidth = imgRef.current?.width || 0;
        const imgHeight = imgRef.current?.height || 0;

        const extraWidth = imgWidth - completedCrop?.width;
        const extraHeight = imgHeight - completedCrop?.height;

        const crop = {
          x: (1 - fraction) * completedCrop?.x,
          y: (1 - fraction) * completedCrop?.y,
          width: completedCrop?.width + fraction * extraWidth,
          height: completedCrop?.height + fraction * extraHeight,
          unit: 'px' as PixelCrop['unit'],
        };

        if (imgRef.current && previewCanvasesRef.current) {
          canvasPreview(imgRef.current!, previewCanvasesRef.current[i], crop);
        }

        return crop;
      },
    );

    setCrops(generatedCrops);
  }, [completedCrop, imgRef, previewCanvasesRef, ramp, rate, setCrops]);
};
