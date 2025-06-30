import { useCallback, useEffect, useRef, useState } from 'react';
import { Uppy } from '@uppy/core';

interface CustomDropzoneProps {
  uppy: Uppy;
}

const CustomDropzone: React.FC<CustomDropzoneProps> = ({ uppy }) => {
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const files = event.dataTransfer?.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        try {
          uppy.addFile({
            name: file.name,
            type: file.type,
            data: file,
            source: 'CustomDropzone',
          });
        } catch (err) {
          console.error('Error adding file to Uppy:', err);
        }
      });
    },
    [uppy]
  );

  const preventDefaults = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const onDragEnter = () => setIsDragging(true);
    const onDragLeave = () => setIsDragging(false);

    const dragEvents: [string, EventListener][] = [
      ['dragenter', preventDefaults],
      ['dragover', preventDefaults],
      ['dragleave', preventDefaults],
      ['drop', preventDefaults],
    ];

    dragEvents.forEach(([event, handler]) =>
      dropArea.addEventListener(event, handler)
    );

    dropArea.addEventListener('drop', handleDrop as EventListener);
    dropArea.addEventListener('dragenter', onDragEnter);
    dropArea.addEventListener('dragleave', onDragLeave);

    return () => {
      dragEvents.forEach(([event, handler]) =>
        dropArea.removeEventListener(event, handler)
      );
      dropArea.removeEventListener('drop', handleDrop as EventListener);
      dropArea.removeEventListener('dragenter', onDragEnter);
      dropArea.removeEventListener('dragleave', onDragLeave);
    };
  }, [handleDrop]);

  return (
    <div
      ref={dropRef}
      style={{
        border: isDragging ? '3px dashed #0077ff' : '2px dashed #ccc',
        padding: '40px',
        textAlign: 'center',
        marginTop: '20px',
        background: isDragging ? '#e6f7ff' : '#f9f9f9',
        color: '#666',
        transition: 'border 0.2s ease-in-out',
      }}
    >
      {isDragging ? 'Drop files here...' : 'Drag & drop files here or use the dashboard above'}
    </div>
  );
};

export default CustomDropzone;
