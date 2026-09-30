import { useRef, useState, useCallback } from "react";

export default function MagneticCard({
  children,
  className = "",
  intensity = 16,
  maxTilt = 5,
  ...props
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState(
    "translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)",
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1 based on center
      const offsetX = (e.clientX - cardCenterX) / (rect.width / 2);
      const offsetY = (e.clientY - cardCenterY) / (rect.height / 2);

      // Clamp values between -1 and 1
      const clampedX = Math.max(-1, Math.min(1, offsetX));
      const clampedY = Math.max(-1, Math.min(1, offsetY));

      // Magnetic pull translation & 3D tilt
      const translateX = clampedX * intensity;
      const translateY = clampedY * intensity;
      const rotateY = clampedX * maxTilt;
      const rotateX = -clampedY * maxTilt;

      setTransformStyle(
        `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(
          2,
        )}px, 0px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2,
        )}deg)`,
      );
    },
    [intensity, maxTilt],
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Smoothly spring back to origin
    setTransformStyle("translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`will-change-transform ${className}`}
      style={{
        transform: transformStyle,
        transformStyle: "preserve-3d",
        perspective: 1000,
        transition: isHovered
          ? "transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)"
          : "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}
