import { ORDER_STEPS } from "../lib/format.js";

export default function Tracker({ status }) {
  const at = ORDER_STEPS.indexOf(status);
  return (
    <ol className="tracker">
      {ORDER_STEPS.map((s, i) => (
        <li key={s} className={i <= at ? "done" : ""}>{s}</li>
      ))}
    </ol>
  );
}
