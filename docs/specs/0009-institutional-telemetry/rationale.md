# Rationale for 0009 Institutional Population Health Telemetry Feed

## Why Privacy Preserving Institutional Telemetry Matters

In tertiary institutions across Nigeria, student healthcare data carries social sensitivity. Stigma around certain health conditions or fear of disciplinary scrutiny makes students hesitant to report symptoms if their identities are tied to digital health platforms. MedWay addresses this by decoupling individual routing from institutional analytics.

## Non Diagnostic Public Health Framing

MedWay explicitly avoids diagnostic claims. The telemetry feed does not report disease incidence or clinical diagnoses. Instead, it tracks demand logistics:
- How often did students search for antimalarials versus analgesics or typhoid tests?
- Which campus retail pharmacies and clinic dispensaries are currently flagged with zero stock?
- What proportion of visits experience high wait times over 45 minutes?

These supply chain indicators provide administrative insight into procurement needs without infringing on clinical boundaries.

## Pure Vector SVG Charts over Heavy Canvas Libraries

Instead of introducing heavy charting dependencies like Chart.js, Recharts, or D3 (which inflate bundle size and often produce inaccessible raster canvases), MedWay utilizes semantic SVG elements:
- Built in accessibility: `<svg role="graphics-document" aria-label="...">` with semantic `<title>` and `<desc>` elements for screen readers.
- Scalable vector rendering that crisply adapts across high density mobile screens and desktop monitors.
- Strict clinical slate tokens ensuring contrast ratios exceed WCAG AA standards (4.5:1 minimum).
