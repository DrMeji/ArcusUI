import arcusLogo from "../assets/arcus-logo.png";

interface ArcusLogoProps {
  className?: string;
  alt?: string;
}

export function ArcusLogo({ className = "", alt = "" }: ArcusLogoProps) {
  return (
    <img
      src={arcusLogo}
      alt={alt}
      className={className}
      draggable={false}
    />
  );
}
