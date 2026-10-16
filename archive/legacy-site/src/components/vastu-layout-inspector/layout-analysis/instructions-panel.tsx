export default function InstructionsPanel() {
  return (
    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-2 font-medium text-blue-900">Instructions:</h3>
      <ul className="space-y-1 text-sm text-blue-800">
        <li>
          • Click and drag the transparent compass center to position it
          anywhere on the image
        </li>
        <li>
          • Each direction has its own color: N (red), NE (orange), E (amber),
          SE (lime), S (emerald), SW (cyan), W (violet), NW (fuchsia)
        </li>
        <li>
          • Colored lines extend to the edges showing precise directional
          alignment
        </li>
        <li>
          • Use this to analyze the directional orientation of rooms and
          elements in your layout
        </li>
        <li>
          • Your image is automatically saved locally and will persist after
          page refresh
        </li>
      </ul>
    </div>
  );
}
