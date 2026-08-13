import type { Metadata } from "next";
import "./prototype.css";
import { IntegratedVariant } from "./variants/integrated.tsx";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Amartya Singh — Product Engineer",
};

export default function Portfolio() {
  return <IntegratedVariant />;
}
