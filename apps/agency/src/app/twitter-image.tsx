import OpengraphImage, {
  alt as opengraphAlt,
  size as opengraphSize,
} from "./opengraph-image.tsx";

export const alt = opengraphAlt;
export const size = opengraphSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return OpengraphImage();
}
