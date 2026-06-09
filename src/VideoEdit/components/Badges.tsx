import { FONT_STACK } from "../theme";

// Official-style agency badges. Government agency logos aren't on keyless logo
// CDNs, so these are crafted with the agencies' real official colors + wordmarks
// to read as premium, trustworthy "logo" objects on the cards (Rule 10: cards
// must look valuable, not bare text).

const Eagle: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* simplified heraldic eagle silhouette */}
    <path
      d="M50 20 L58 30 L74 26 L64 38 L82 42 L62 48 L70 62 L54 54 L50 72 L46 54 L30 62 L38 48 L18 42 L36 38 L26 26 L42 30 Z"
      fill={color}
    />
    <circle cx="50" cy="44" r="6" fill={color} />
  </svg>
);

// Social Security Administration — official deep blue.
export const SSABadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22 * scale,
      padding: `${20 * scale}px ${30 * scale}px`,
      borderRadius: 22 * scale,
      background: "linear-gradient(150deg, #0A3D91 0%, #052C6E 100%)",
      boxShadow:
        "0 24px 60px rgba(5,44,110,0.5), inset 0 1px 0 rgba(255,255,255,0.25)",
      fontFamily: FONT_STACK,
    }}
  >
    <div
      style={{
        width: 64 * scale,
        height: 64 * scale,
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Eagle size={46 * scale} color="#0A3D91" />
    </div>
    <div style={{ lineHeight: 1.05 }}>
      <div style={{ color: "#fff", fontSize: 30 * scale, fontWeight: 800, letterSpacing: 0.5 }}>
        Social Security
      </div>
      <div style={{ color: "rgba(255,255,255,0.78)", fontSize: 20 * scale, fontWeight: 600 }}>
        ssa.gov
      </div>
    </div>
  </div>
);

// Medicare — official Medicare blue wordmark.
export const MedicareBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 16 * scale,
      padding: `${18 * scale}px ${34 * scale}px`,
      borderRadius: 20 * scale,
      background: "#fff",
      boxShadow: "0 24px 60px rgba(0,113,188,0.4), inset 0 1px 0 rgba(255,255,255,0.6)",
      fontFamily: FONT_STACK,
    }}
  >
    <div
      style={{
        color: "#0071BC",
        fontSize: 44 * scale,
        fontWeight: 800,
        letterSpacing: -0.5,
        fontStyle: "italic",
      }}
    >
      Medicare
    </div>
    <div
      style={{
        width: 16 * scale,
        height: 16 * scale,
        borderRadius: "50%",
        background: "#E4002B",
        marginTop: -18 * scale,
      }}
    />
  </div>
);

// U.S. Department of Labor — navy seal-style badge.
export const DOLBadge: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 20 * scale,
      padding: `${18 * scale}px ${30 * scale}px`,
      borderRadius: 22 * scale,
      background: "linear-gradient(150deg, #12325C 0%, #0B2038 100%)",
      boxShadow: "0 24px 60px rgba(11,32,56,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
      fontFamily: FONT_STACK,
    }}
  >
    <div
      style={{
        width: 64 * scale,
        height: 64 * scale,
        borderRadius: "50%",
        border: `${3 * scale}px solid #C9A24B`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Eagle size={42 * scale} color="#C9A24B" />
    </div>
    <div style={{ lineHeight: 1.08 }}>
      <div style={{ color: "#fff", fontSize: 22 * scale, fontWeight: 800, letterSpacing: 1 }}>
        U.S. DEPARTMENT
      </div>
      <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 22 * scale, fontWeight: 800, letterSpacing: 1 }}>
        OF LABOR
      </div>
    </div>
  </div>
);
