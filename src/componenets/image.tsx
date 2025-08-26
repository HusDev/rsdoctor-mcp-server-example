function Image({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <picture>
      <source media='(max-width: 768px)' srcSet={src} sizes='100vw' />
      <source media='(max-width: 1200px)' srcSet={src} sizes='90vw' />
      <img
        src={src}
        alt={alt}
        className={className}
        loading='lazy'
        decoding='async'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px'
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </picture>
  );
}

export default Image;
