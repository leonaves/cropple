'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactCrop, {
  centerCrop,
  type Crop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';

import 'react-image-crop/dist/ReactCrop.css';
import { getFileUrl } from '@/utils/getFileUrl';
import { useGenerateCrops } from '@/utils/useGenerateCrops';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function Upload() {
  const aspect = 1;

  const [crop, setCrop] = useState<Crop>();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [ramp, setRamp] = useState<number>(0);
  const [imgSrc, setImgSrc] = useState('');
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const blobUrlRef = useRef('');
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);

  const onSelectFile = getFileUrl({
    beforeLoad: () => setCrop(undefined),
    onLoad: setImgSrc,
  });

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  useGenerateCrops({
    ramp,
    completedCrop,
    setCrops,
    imgRef,
    previewCanvasesRef,
  });

  const onDownloadCropClick = async () => {
    const imageElement = imgRef.current;
    const previewCanvas = previewCanvasesRef.current[0];

    if (!imageElement || !previewCanvas || !completedCrop) {
      throw new Error('Crop canvas does not exist');
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = imageElement.naturalWidth / imageElement.width;
    const scaleY = imageElement.naturalHeight / imageElement.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );

    const ctx = offscreen.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    const blob = await offscreen.convertToBlob({
      type: 'image/jpeg',
      quality: 0.95,
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    blobUrlRef.current = URL.createObjectURL(blob);

    if (hiddenAnchorRef.current) {
      hiddenAnchorRef.current.href = blobUrlRef.current;
      hiddenAnchorRef.current.click();
    }
  };

  return (
    <div className="sm container flex flex-col gap-4">
      <h1 className="mt-4 text-3xl">Upload</h1>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      <div className="sm container flex gap-2">
        <div>
          {!!imgSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => {
                setCrop(percentCrop);
                setCompletedCrop(_);
              }}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              minWidth={50}
              minHeight={50}
            >
              <img
                ref={imgRef}
                src={imgSrc}
                alt="Uploaded image to crop"
                onLoad={onImageLoad}
              />
              {crops.map((crop, i) => (
                <div
                  key={i}
                  className="absolute top-0 border-2 border-dashed border-red-400"
                  style={{
                    transform: `translate(${crop.x}px, ${crop.y}px)`,
                    width: `${crop.width}px`,
                    height: `${crop.height}px`,
                  }}
                ></div>
              ))}
            </ReactCrop>
          )}
        </div>
        <div className="min-w-[30%]">
          {!!completedCrop && (
            <div>
              <div className={`relative flex h-[200px] w-full flex-col gap-1`}>
                <div
                  className={`relative flex h-[200px] w-full flex-col gap-1`}
                >
                  <label htmlFor="ramp">Ramp:</label>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.01}
                    value={ramp}
                    onChange={(e) => setRamp(parseFloat(e.target.value))}
                  />
                </div>
                <button onClick={onDownloadCropClick}>Download Crop</button>
                <a
                  href="#hidden"
                  ref={hiddenAnchorRef}
                  download
                  style={{
                    position: 'absolute',
                    top: '-200vh',
                    visibility: 'hidden',
                  }}
                >
                  Hidden download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4 flex h-[250px] max-w-full grow-[1] gap-2 overflow-auto">
        {!!completedCrop &&
          crops.map((_, i) => (
            <canvas
              key={i}
              className="h-full"
              ref={(el) => (previewCanvasesRef.current[i] = el!)}
              style={{
                border: '1px solid black',
                height: '100%',
              }}
            />
          ))}
      </div>
    </div>
  );
}
