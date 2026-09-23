"use client";

import { Geographies, Geography, Marker } from "react-simple-maps";
import {
  temperatureToColorSmooth,
} from "@/lib/map-features";
import type { TempSample } from "@/lib/map-weather";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Props = {
  samples: TempSample[];
  zoom: number;
};

/**
 * Мягкий тепловой слой: размытые пятна, обрезанные маской по суше.
 */
export default function TemperatureHeatLayer({ samples, zoom }: Props) {
  const radius = Math.max(18, Math.min(52, 44 / Math.sqrt(Math.max(zoom, 0.85))));
  const blur = Math.max(7, Math.min(18, 14 / Math.sqrt(Math.max(zoom, 0.85))));

  return (
    <>
      <defs>
        <filter
          id="temp-heat-blur"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} />
        </filter>
        <mask
          id="temp-land-mask"
          maskUnits="userSpaceOnUse"
        >
          <rect x={-2000} y={-2000} width={8000} height={8000} fill="#000" />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={`mask-${geo.rsmKey}`}
                  geography={geo}
                  fill="#fff"
                  stroke="none"
                  style={{ outline: "none" }}
                />
              ))
            }
          </Geographies>
        </mask>
      </defs>

      <g
        mask="url(#temp-land-mask)"
        filter="url(#temp-heat-blur)"
        style={{ pointerEvents: "none" }}
        opacity={0.92}
      >
        {samples.map((sample) => (
          <Marker
            key={sample.id}
            coordinates={[sample.longitude, sample.latitude]}
          >
            <circle
              r={radius}
              fill={temperatureToColorSmooth(sample.tempC)}
              fillOpacity={0.72}
            />
          </Marker>
        ))}
      </g>
    </>
  );
}
