import { useEffect } from "react";
import Topbar from "./layout/Topbar.jsx";
import Footer from "./layout/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import Benefits from "./sections/Benefits.jsx";
import SuitablePartners from "./sections/SuitablePartners.jsx";
import PartnerDirectory from "./sections/PartnerDirectory.jsx";
import DataFoundation from "./sections/DataFoundation.jsx";
import BottomCta from "./sections/BottomCta.jsx";
import { PartnerFormProvider } from "./PartnerFormContext.jsx";
import { useLandingEffects } from "../fx/useLandingEffects.js";

/**
 * Affiliate landing — PRD sections + shared returns layout/FX.
 */
export default function LandingPage() {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);
  useLandingEffects();

  return (
    <PartnerFormProvider>
      <div className="glass-shell affiliate-page">
        <div className="page" id="glass-content">
          <Topbar />
          <main>
            <Hero />
            <Benefits />
            <SuitablePartners />
            <PartnerDirectory />
            <DataFoundation />
            <BottomCta />
          </main>
          <Footer />
        </div>
      </div>
    </PartnerFormProvider>
  );
}
