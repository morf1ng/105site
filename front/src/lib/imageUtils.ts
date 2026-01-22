/**
 * Compresses an image file while maintaining high quality
 * @param file - The original image file
 * @param maxWidth - Maximum width in pixels (default: 1920)
 * @param maxHeight - Maximum height in pixels (default: 1920)
 * @param quality - JPEG/WebP quality 0-1 (default: 0.9 for high quality)
 * @returns Compressed File object
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    // If file is already small enough, return as-is
    if (file.size < 500 * 1024) { // Less than 500KB
      console.log(`[ImageUtils] File ${file.name} is already small (${(file.size / 1024).toFixed(2)}KB), skipping compression`);
      resolve(file);
      return;
    }

    console.log(`[ImageUtils] Compressing ${file.name}: ${(file.size / 1024).toFixed(2)}KB`);

    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => {
        // If image fails to load, return original file
        resolve(file);
      };
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            
            if (width > height) {
              width = Math.min(width, maxWidth);
              height = width / aspectRatio;
              if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
              }
            } else {
              height = Math.min(height, maxHeight);
              width = height * aspectRatio;
              if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
              }
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }
          
          // Use high-quality image rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert PNG to JPEG for better compression (PNG is lossless and doesn't compress well)
          // For other formats, keep original or convert to JPEG
          const outputType = 'image/jpeg'; // Always use JPEG for better compression
          const outputQuality = file.type === 'image/png' ? 0.85 : quality; // Slightly lower quality for PNG->JPEG conversion
          
          // Convert to blob with quality settings
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressionRatio = ((1 - blob.size / file.size) * 100).toFixed(1);
                console.log(`[ImageUtils] Compression result: ${(file.size / 1024).toFixed(2)}KB -> ${(blob.size / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`);
                
                // Only use compressed if it's actually smaller
                if (blob.size < file.size) {
                  // Update filename extension if we converted PNG to JPEG
                  let fileName = file.name;
                  if (file.type === 'image/png' && outputType === 'image/jpeg') {
                    fileName = fileName.replace(/\.png$/i, '.jpg');
                  }
                  
                  const compressedFile = new File([blob], fileName, {
                    type: outputType,
                    lastModified: Date.now()
                  });
                  resolve(compressedFile);
                } else {
                  console.warn(`[ImageUtils] Compression didn't reduce size, using original`);
                  // If compression didn't help, return original
                  resolve(file);
                }
              } else {
                console.error(`[ImageUtils] Failed to create blob`);
                resolve(file);
              }
            },
            outputType,
            outputQuality
          );
        } catch (error) {
          console.error('Error compressing image:', error);
          resolve(file); // Fallback to original on error
        }
      };
      
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        resolve(file);
      }
    };
    
    reader.readAsDataURL(file);
  });
}

