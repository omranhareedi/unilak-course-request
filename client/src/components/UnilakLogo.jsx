export default function UnilakLogo({ size = 40, showText = true }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/unilak-logo.jpg"
        alt="UNILAK"
        width={size}
        height={size}
        className="object-contain"
      />
      {showText && (
        <div className="leading-tight">
          <div className="font-extrabold text-unilak-navy tracking-tight" style={{ fontSize: size * 0.45 }}>
            UNILAK
          </div>
          <div className="text-gray-500" style={{ fontSize: size * 0.22, lineHeight: 1.2 }}>
            University of Lay Adventists of Kigali
          </div>
        </div>
      )}
    </div>
  );
}
