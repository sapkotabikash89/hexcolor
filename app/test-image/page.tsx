import { getGumletImageUrl } from "@/lib/gumlet-utils";

export default function TestImageTag() {
  const hex = "#000000"; // Black color that we know has an image
  const gumletImageUrl = getGumletImageUrl(hex);
  const displayLabel = "Black";
  const rgb = { r: 0, g: 0, b: 0 };

  return (
    <div>
      <h1>Test Image Tag Rendering</h1>
      <p>Testing if img tag appears in static HTML for {hex}</p>
      
      {/* This is the same img tag structure used in the color page */}
      {gumletImageUrl && (
        <div className="flex justify-center my-6">
          <img
            src={gumletImageUrl}
            alt={`${displayLabel} color swatch showing the color visually with RGB(${rgb?.r ?? 0},${rgb?.g ?? 0},${rgb?.b ?? 0}) values`}
            width="1200"
            height="630"
            loading="eager"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      )}
      
      <p>Image URL: {gumletImageUrl || "None"}</p>
      <p>Should render: {gumletImageUrl ? "YES" : "NO"}</p>
    </div>
  );
}