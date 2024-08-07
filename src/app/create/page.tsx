'use client';

import React, { useRef, useState } from 'react';
import ReactCrop, {
  centerCrop,
  type Crop,
  makeAspectCrop,
  PixelCrop,
} from 'react-image-crop';
import { Input } from '@/components/ui/input';

import 'react-image-crop/dist/ReactCrop.css';
import { getFileUrl } from '@/utils/getFileUrl';
import { useGenerateCrops } from '@/utils/useGenerateCrops';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { DatePicker } from '@/components/ui/datepicker';
import { Button } from '@/components/ui/button';
import { uploadPuzzleImage } from '@/utils/uploadPuzzleImage';

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

  const [imgSrc, setImgSrc] = useState('');

  const [crop, setCrop] = useState<Crop>();
  const [crops, setCrops] = useState<PixelCrop[]>([]);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const [ramp, setRamp] = useState<number>(0);
  const [rate, setRate] = useState<number>(2);

  const [date, setDate] = useState<Date>();
  const [solution, setSolution] = useState<string>('');

  const [uploading, setUploading] = useState<boolean | 'done'>(false);

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
    rate,
    completedCrop,
    setCrops,
    imgRef,
    previewCanvasesRef,
  });

  const onCreatePuzzle = async () => {
    if (!date || !solution) {
      return alert('Please fill out the solution and date');
    }

    setUploading(true);

    const uploadPromises = previewCanvasesRef.current.map((canvas, i) => {
      return uploadPuzzleImage({
        solution,
        date,
        image: imgRef.current!,
        canvas,
        crop: crops[i],
        level: i + 1,
      });
    });

    await Promise.all(uploadPromises);

    setUploading('done');
  };

  return (
    <div className="sm container flex flex-col gap-4">
      <h1 className="mt-4 text-3xl">Upload</h1>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onSelectFile}
        />
      </div>
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
              minWidth={25}
              minHeight={25}
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
              <div className={`relative m-2 mt-4 flex w-full flex-col gap-6`}>
                <div className={`relative flex flex-col gap-1`}>
                  <Label htmlFor="ramp">Ramp:</Label>
                  <Slider
                    min={-1}
                    max={1}
                    step={0.01}
                    value={[ramp]}
                    onValueChange={([ramp]: number[]) => setRamp(ramp)}
                  />
                </div>
                <div className={`relative flex flex-col gap-1`}>
                  <Label htmlFor="rate">Rate:</Label>
                  <Slider
                    min={1}
                    max={4}
                    step={0.01}
                    value={[rate]}
                    onValueChange={([rate]: number[]) => setRate(rate)}
                  />
                </div>
                <Input
                  type="solution"
                  placeholder="Solution"
                  onChange={(e) => setSolution(e.target.value)}
                  value={solution}
                />
                <DatePicker
                  placeholder="Choose date of puzzle"
                  value={date}
                  onChange={setDate}
                />
                <Button onClick={onCreatePuzzle}>
                  {uploading
                    ? uploading === 'done'
                      ? 'Uploaded!'
                      : 'Uploading...'
                    : 'Create Puzzle'}
                </Button>
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
