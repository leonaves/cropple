import React from 'react';

export function getFileUrl({
  beforeLoad,
  onLoad,
}: {
  beforeLoad?: () => void;
  onLoad?: (url: string) => void;
}) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (beforeLoad) beforeLoad();
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        onLoad ? () => onLoad(reader.result?.toString() || '') : () => {},
      );

      reader.readAsDataURL(e.target.files[0]);
    }
  };
}
