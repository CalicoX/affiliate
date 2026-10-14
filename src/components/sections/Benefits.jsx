import { BENEFITS } from "../../content/affiliateCopy.js";
import BecomePartnerButton from "../BecomePartnerButton.jsx";
import { CommissionScene, LogisticsScene, ValueScene } from "./RouteScenes.jsx";

const SCENES = {
  slow: LogisticsScene,
  plot: CommissionScene,
  terrain: ValueScene,
};

export default function Benefits() {
  return (
    <section className="section af-benefits" id="benefits">
      <div className="section-inner">
        <div className="section-head center">
          <p className="af-eyebrow">{BENEFITS.eyebrow}</p>
          <h2 className="af-benefit-title">{BENEFITS.title}</h2>
          <p className="lead">{BENEFITS.lead}</p>
        </div>

        <div className="af-benefit-row">
          {BENEFITS.items.map((item) => {
            const Scene = SCENES[item.figure];
            return (
              <article className="af-benefit-item" key={item.title}>
                <Scene />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>

        <div className="af-section-cta">
          <BecomePartnerButton />
        </div>
      </div>
    </section>
  );
}
