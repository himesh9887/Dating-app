import { classNames } from "../../utils/helpers";

const GlassPanel = ({ className, children }) => (
  <div className={classNames("glass-panel", className)}>{children}</div>
);

export default GlassPanel;
