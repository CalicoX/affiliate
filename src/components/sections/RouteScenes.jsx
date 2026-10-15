/** Scene photo plus a frosted product UI, in the Route frame. */

function RouteLine() {
  return (
    <svg className="rt-illu-map" viewBox="0 0 280 72" fill="none">
      <path className="rt-illu-route" d="M8 54 C 60 54, 70 16, 140 22 S 214 60, 270 18" />
      <circle cx="8" cy="54" r="4" fill="#0f766e" />
      <circle cx="270" cy="18" r="4" fill="#003a9b" />
    </svg>
  );
}

function Frame({ src, position = "center center", shift = "none", children }) {
  return (
    <div className="rt-illu">
      {src ? (
        <img src={src} alt="" style={{ objectPosition: position, transform: shift }} />
      ) : null}
      {children ? <div className="rt-illu-glass">{children}</div> : null}
    </div>
  );
}

function SlideLayers({ src, photoStyle, glassStyle, children }) {
  return (
    <>
      <img className="af-slide-bg" src={src} alt="" style={photoStyle} />
      <div className="rt-illu-glass af-slide-ui" style={glassStyle}>
        {children}
      </div>
    </>
  );
}

export function PartnerVisual({ id, photoStyle, glassStyle }) {
  if (id === "agency") {
    return (
      <SlideLayers
        src="/assets/scenes/theme-visibility.jpg"
        photoStyle={{
          ...photoStyle,
          filter: "saturate(0.55) hue-rotate(-16deg) contrast(1.04) brightness(1.04)",
        }}
        glassStyle={glassStyle}
      >
        <article className="rt-illu-card rt-illu-card--wide">
          <p>Shipment visibility</p>
          <RouteLine />
          <strong className="rt-illu-chip">+ revenue</strong>
        </article>
      </SlideLayers>
    );
  }
  if (id === "logistics") {
    return (
      <SlideLayers
        src="/assets/scenes/theme-ups-flight.jpg"
        photoStyle={{
          ...photoStyle,
          objectFit: "cover",
          objectPosition: "center top",
          transform:
            typeof photoStyle?.transform === "string"
              ? photoStyle.transform.replace(/scale\([^)]+\)/, "scale(1)")
              : photoStyle?.transform,
        }}
        glassStyle={glassStyle}
      >
        <article className="rt-illu-card rt-illu-card--wide rt-illu-card--carriers">
          <div className="rt-illu-head">
            <p>3,500+ carriers</p>
            <span className="rt-illu-live">Live</span>
          </div>
          <div className="rt-illu-rows">
            {[
              ["usps", "USPS", "United States · Delivered"],
              ["ups", "UPS", "North America · In transit"],
              ["dhl", "DHL", "Europe · Customs cleared"],
              ["fedex", "FedEx", "Asia Pacific · Out for delivery"],
            ].map(([file, name, detail]) => (
              <div key={file}>
                <span className="rt-illu-carrier">
                  <img
                    className="rt-illu-logo"
                    src={`/assets/carriers/${file}.svg`}
                    alt=""
                    height="20"
                  />
                  <b>{name}</b>
                </span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
          <div className="rt-illu-stats">
            <span><strong>230</strong> countries</span>
            <span><strong>1</strong> event format</span>
          </div>
        </article>
      </SlideLayers>
    );
  }
  return (
    <SlideLayers src="/assets/scenes/theme-infrastructure.jpg" photoStyle={photoStyle} glassStyle={glassStyle}>
      <article className="rt-illu-card rt-illu-card--back">
        <p>Tracking</p>
        <RouteLine />
      </article>
      <article className="rt-illu-card rt-illu-card--front">
        <p>Post-purchase</p>
        <ul>
          <li>Order protected</li>
          <li>Live tracking</li>
          <li>Branded updates</li>
        </ul>
      </article>
    </SlideLayers>
  );
}

export function InfrastructureScene() {
  return (
    <Frame src="/assets/scenes/theme-infrastructure.jpg">
      <article className="rt-illu-card rt-illu-card--back">
        <p>Tracking</p>
        <RouteLine />
      </article>
      <article className="rt-illu-card rt-illu-card--front">
        <p>Post-purchase</p>
        <ul>
          <li>Order protected</li>
          <li>Live tracking</li>
          <li>Branded updates</li>
        </ul>
      </article>
    </Frame>
  );
}

export function VisibilityScene() {
  return (
    <Frame src="/assets/scenes/theme-visibility.jpg">
      <article className="rt-illu-card rt-illu-card--wide">
        <p>Shipment visibility</p>
        <RouteLine />
        <strong className="rt-illu-chip">+ revenue</strong>
      </article>
    </Frame>
  );
}

export function CarrierScene() {
  return (
    <Frame src="/assets/scenes/theme-ups-flight.jpg">
      <article className="rt-illu-card rt-illu-card--wide">
        <p>3,500+ carriers</p>
        <div className="rt-illu-nodes">
          {["USPS", "UPS", "DHL", "FedEx"].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </article>
    </Frame>
  );
}

export function LogisticsScene() {
  return <Frame src="/assets/scenes/theme-benefit-logistics-v2.jpg" />;
}

export function CommissionScene() {
  return <Frame src="/assets/scenes/theme-benefit-referral-v2.jpg" />;
}

export function ValueScene() {
  return <Frame src="/assets/scenes/theme-benefit-customer-v2.jpg" />;
}
