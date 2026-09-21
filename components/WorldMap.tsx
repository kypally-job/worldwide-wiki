"use client";

import Link from "next/link";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  countries,
  findCountryByMapKey,
  getCountryBySlug,
  type Country,
} from "@/lib/countries";
import {
  MAP_FILTERS,
  TEMP_LEGEND,
  countryMatchesFilters,
  temperatureToColor,
  type MapFilterId,
} from "@/lib/map-features";
import { fetchCountryTemperatures } from "@/lib/map-weather";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type GeographyProperties = {
  name?: string;
  NAME?: string;
  ADMIN?: string;
};

type MapGeography = {
  rsmKey: string;
  properties: GeographyProperties;
};

type MapView = {
  coordinates: [number, number];
  zoom: number;
};

type CardPosition = {
  left: number;
  top: number;
};

type DragState = {
  offsetX: number;
  offsetY: number;
};

const initialView: MapView = {
  coordinates: [0, 0],
  zoom: 1.35,
};

const CARD_WIDTH = 350;
const CARD_HEIGHT = 430;
const MAP_EDGE_PADDING = 24;
const CURSOR_GAP = 36;

function getGeographyEnglishName(geo: MapGeography): string {
  return (
    geo.properties.name ??
    geo.properties.NAME ??
    geo.properties.ADMIN ??
    ""
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getMapCenter(country: Country): [number, number] {
  const [latitude, longitude] = country.mapCoordinates;

  return [longitude, latitude];
}

function getSafeCardPosition(
  clickX: number,
  clickY: number,
  mapWidth: number,
  mapHeight: number,
): CardPosition {
  const availableRight = mapWidth - clickX - MAP_EDGE_PADDING;
  const availableLeft = clickX - MAP_EDGE_PADDING;

  const openToRight =
    availableRight >= CARD_WIDTH + CURSOR_GAP ||
    availableRight >= availableLeft;

  const preferredLeft = openToRight
    ? clickX + CURSOR_GAP
    : clickX - CARD_WIDTH - CURSOR_GAP;

  const preferredTop =
    clickY + CARD_HEIGHT + MAP_EDGE_PADDING <= mapHeight
      ? clickY
      : clickY - CARD_HEIGHT;

  return {
    left: clamp(
      preferredLeft,
      MAP_EDGE_PADDING,
      Math.max(
        MAP_EDGE_PADDING,
        mapWidth - CARD_WIDTH - MAP_EDGE_PADDING,
      ),
    ),
    top: clamp(
      preferredTop,
      MAP_EDGE_PADDING,
      Math.max(
        MAP_EDGE_PADDING,
        mapHeight - CARD_HEIGHT - MAP_EDGE_PADDING,
      ),
    ),
  };
}

export default function WorldMap({
  initialCountrySlug,
}: {
  initialCountrySlug?: string;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const [search, setSearch] = useState("");
  const [hoveredCountry, setHoveredCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    null,
  );
  const [cardPosition, setCardPosition] = useState<CardPosition | null>(null);
  const [isCardDragging, setIsCardDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const [view, setView] = useState<MapView>(initialView);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<MapFilterId[]>([]);
  const [showTemperature, setShowTemperature] = useState(false);
  const [temperatures, setTemperatures] = useState<Record<string, number>>(
    {},
  );
  const [tempLoading, setTempLoading] = useState(false);
  const [tempError, setTempError] = useState("");

  const searchResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return [];
    }

    return countries.filter((country) => {
      const searchableText = [
        country.name,
        country.region,
        country.description,
        ...country.highlights,
        ...Object.values(country.wiki),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [search]);

  const getGeographyName = (geo: MapGeography): string => {
    const englishName = getGeographyEnglishName(geo);
    const projectCountry = englishName
      ? findCountryByMapKey(englishName)
      : undefined;

    return projectCountry?.name || englishName || "Неизвестная страна";
  };

  const findProjectCountry = (
    geo: MapGeography | string,
  ): Country | undefined => {
    if (typeof geo === "string") {
      const normalizedName = geo.trim().toLowerCase();

      return (
        findCountryByMapKey(geo) ??
        countries.find(
          (country) => country.name.trim().toLowerCase() === normalizedName,
        )
      );
    }

    const englishName = getGeographyEnglishName(geo);
    return englishName ? findCountryByMapKey(englishName) : undefined;
  };

  const closeCountryCard = () => {
    setSelectedCountry(null);
    setCardPosition(null);
    setIsCardDragging(false);
    dragStateRef.current = null;
  };

  const placeCardOnMap = () => {
    const mapElement = mapContainerRef.current;

    if (!mapElement) {
      setCardPosition(null);
      return;
    }

    const mapRect = mapElement.getBoundingClientRect();

    setCardPosition({
      left: clamp(
        mapRect.width - CARD_WIDTH - MAP_EDGE_PADDING,
        MAP_EDGE_PADDING,
        Math.max(
          MAP_EDGE_PADDING,
          mapRect.width - CARD_WIDTH - MAP_EDGE_PADDING,
        ),
      ),
      top: clamp(
        72,
        MAP_EDGE_PADDING,
        Math.max(
          MAP_EDGE_PADDING,
          mapRect.height - CARD_HEIGHT - MAP_EDGE_PADDING,
        ),
      ),
    });
  };

  const openCountryCard = (
    projectCountry: Country,
    nextPosition?: CardPosition,
  ) => {
    setNotice("");
    setSearch("");
    setSelectedCountry(projectCountry);

    if (nextPosition) {
      setCardPosition(nextPosition);
      return;
    }

    placeCardOnMap();
  };

  const flyToCountry = (projectCountry: Country) => {
    setView((currentView) => ({
      coordinates: getMapCenter(projectCountry),
      zoom: Math.max(currentView.zoom, 3.2),
    }));
  };

  const handleRandomCountry = () => {
    const filtered = countries.filter((country) =>
      countryMatchesFilters(country.countryCode, activeFilters),
    );
    const base = filtered.length > 0 ? filtered : countries;
    const pool = base.filter(
      (country) => country.slug !== selectedCountry?.slug,
    );
    const list = pool.length > 0 ? pool : base;

    if (list.length === 0) {
      return;
    }

    const next = list[Math.floor(Math.random() * list.length)];

    openCountryCard(next);
    flyToCountry(next);
  };

  const toggleFilter = (id: MapFilterId) => {
    setActiveFilters((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleTemperature = () => {
    setShowTemperature((current) => !current);
  };

  useEffect(() => {
    if (!initialCountrySlug) {
      return;
    }

    const country = getCountryBySlug(initialCountrySlug);

    if (!country) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      openCountryCard(country);
      flyToCountry(country);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [initialCountrySlug]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice("");
    }, 2800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notice]);

  useEffect(() => {
    if (!selectedCountry) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCountryCard();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedCountry]);

  useEffect(() => {
    const mapElement = mapContainerRef.current;

    if (!mapElement) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
    };

    mapElement.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      mapElement.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    if (!showTemperature) {
      setTempLoading(false);
      return;
    }

    const controller = new AbortController();
    setTempLoading(true);
    setTempError("");

    fetchCountryTemperatures(countries, controller.signal)
      .then((data) => {
        setTemperatures(data);
        setTempLoading(false);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setTempLoading(false);
        setTempError("Не удалось загрузить температуру");
        setNotice(
          error instanceof Error
            ? `Температура: ${error.message}`
            : "Не удалось загрузить температуру",
        );
      });

    return () => {
      controller.abort();
    };
  }, [showTemperature]);

  const handleCountryClick = (
    geo: MapGeography,
    event: ReactMouseEvent<SVGPathElement>,
  ) => {
    event.stopPropagation();

    const projectCountry = findProjectCountry(geo);
    const countryName = getGeographyName(geo);

    if (!projectCountry) {
      closeCountryCard();
      setNotice(`«${countryName}» пока нет в базе`);
      return;
    }

    const mapElement = event.currentTarget.ownerSVGElement;

    if (!mapElement) {
      openCountryCard(projectCountry);
      return;
    }

    const mapRect = mapElement.getBoundingClientRect();
    const clickX = event.clientX - mapRect.left;
    const clickY = event.clientY - mapRect.top;

    openCountryCard(
      projectCountry,
      getSafeCardPosition(
        clickX,
        clickY,
        mapRect.width,
        mapRect.height,
      ),
    );
  };

  const handleSearchSelect = (projectCountry: Country) => {
    openCountryCard(projectCountry);
    flyToCountry(projectCountry);
  };

  const handleMapBackgroundClick = (
    event: ReactMouseEvent<SVGSVGElement>,
  ) => {
    const target = event.target as Element;
    const clickedCountry = target.closest(".rsm-geography");

    if (!clickedCountry) {
      closeCountryCard();
      setNotice("");
    }
  };

  const handleCardDragStart = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    const target = event.target as HTMLElement;

    if (
      target.closest("button") ||
      target.closest("a") ||
      !mapContainerRef.current ||
      !cardPosition
    ) {
      return;
    }

    const mapRect = mapContainerRef.current.getBoundingClientRect();

    dragStateRef.current = {
      offsetX: event.clientX - mapRect.left - cardPosition.left,
      offsetY: event.clientY - mapRect.top - cardPosition.top,
    };

    setIsCardDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCardDragMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      !isCardDragging ||
      !dragStateRef.current ||
      !mapContainerRef.current
    ) {
      return;
    }

    const mapRect = mapContainerRef.current.getBoundingClientRect();

    const nextLeft =
      event.clientX -
      mapRect.left -
      dragStateRef.current.offsetX;

    const nextTop =
      event.clientY -
      mapRect.top -
      dragStateRef.current.offsetY;

    setCardPosition({
      left: clamp(
        nextLeft,
        MAP_EDGE_PADDING,
        Math.max(
          MAP_EDGE_PADDING,
          mapRect.width - CARD_WIDTH - MAP_EDGE_PADDING,
        ),
      ),
      top: clamp(
        nextTop,
        MAP_EDGE_PADDING,
        Math.max(
          MAP_EDGE_PADDING,
          mapRect.height - CARD_HEIGHT - MAP_EDGE_PADDING,
        ),
      ),
    });
  };

  const handleCardDragEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    setIsCardDragging(false);
    dragStateRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (!mapContainerRef.current || !cardPosition) {
      return;
    }

    const step = event.shiftKey ? 40 : 16;

    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown"
    ) {
      return;
    }

    event.preventDefault();

    const mapRect = mapContainerRef.current.getBoundingClientRect();

    setCardPosition({
      left: clamp(
        cardPosition.left +
          (event.key === "ArrowLeft"
            ? -step
            : event.key === "ArrowRight"
              ? step
              : 0),
        MAP_EDGE_PADDING,
        Math.max(
          MAP_EDGE_PADDING,
          mapRect.width - CARD_WIDTH - MAP_EDGE_PADDING,
        ),
      ),
      top: clamp(
        cardPosition.top +
          (event.key === "ArrowUp"
            ? -step
            : event.key === "ArrowDown"
              ? step
              : 0),
        MAP_EDGE_PADDING,
        Math.max(
          MAP_EDGE_PADDING,
          mapRect.height - CARD_HEIGHT - MAP_EDGE_PADDING,
        ),
      ),
    });
  };

  const handleZoomIn = () => {
    setView((currentView) => ({
      ...currentView,
      zoom: Math.min(currentView.zoom + 0.35, 8),
    }));
  };

  const handleZoomOut = () => {
    setView((currentView) => ({
      ...currentView,
      zoom: Math.max(currentView.zoom - 0.35, 0.85),
    }));
  };

  return (
    <div
      ref={mapContainerRef}
      className="relative h-full min-h-0 overflow-hidden bg-[var(--map-fill)]"
    >
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{
          scale: 190,
          center: [0, 5],
        }}
        width={1200}
        height={700}
        className="block h-full w-full cursor-grab select-none bg-[var(--map-fill)] active:cursor-grabbing"
        onClick={handleMapBackgroundClick}
      >
        <ZoomableGroup
          center={view.coordinates}
          zoom={view.zoom}
          minZoom={0.85}
          maxZoom={8}
          filterZoomEvent={(event) => {
            if (event instanceof MouseEvent && event.button === 2) {
              return false;
            }

            if ("ctrlKey" in event && (event as MouseEvent).ctrlKey) {
              return false;
            }

            return true;
          }}
          onMoveEnd={({ coordinates, zoom }) => {
            if (!coordinates) {
              return;
            }

            setView((currentView) => ({
              coordinates: coordinates as [number, number],
              zoom:
                typeof zoom === "number" ? zoom : currentView.zoom,
            }));
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const typedGeo = geo as MapGeography;
                const countryName = getGeographyName(typedGeo);
                const projectCountry = findProjectCountry(typedGeo);
                const isHovered = hoveredCountry === countryName;
                const isAvailable = Boolean(projectCountry);
                const isSelected =
                  Boolean(projectCountry) &&
                  selectedCountry?.slug === projectCountry?.slug;
                const matchesFilter = countryMatchesFilters(
                  projectCountry?.countryCode,
                  activeFilters,
                );
                const isFilteredOut =
                  activeFilters.length > 0 && isAvailable && !matchesFilter;
                const tempC = projectCountry
                  ? temperatures[projectCountry.countryCode]
                  : undefined;

                let fill: string;
                if (!isAvailable) {
                  fill = "var(--map-unknown)";
                } else if (
                  showTemperature &&
                  typeof tempC === "number" &&
                  !isFilteredOut
                ) {
                  fill = temperatureToColor(tempC);
                } else if (isSelected) {
                  fill = "var(--map-known-active)";
                } else if (isHovered && !isFilteredOut) {
                  fill = "var(--map-known-hover)";
                } else if (isFilteredOut) {
                  fill = "var(--map-unknown)";
                } else {
                  fill = "var(--map-known)";
                }

                return (
                  <Geography
                    key={typedGeo.rsmKey}
                    geography={geo}
                    className={
                      isAvailable && !isFilteredOut
                        ? "cursor-pointer"
                        : "cursor-default"
                    }
                    fill={fill}
                    stroke="var(--map-stroke)"
                    strokeWidth={0.55}
                    opacity={isFilteredOut ? 0.28 : 1}
                    onMouseEnter={() => setHoveredCountry(countryName)}
                    onMouseLeave={() => setHoveredCountry("")}
                    onClick={(event) => {
                      if (isFilteredOut) {
                        event.stopPropagation();
                        return;
                      }
                      handleCountryClick(typedGeo, event);
                    }}
                    style={{
                      outline: "none",
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-ink/35 via-ink/10 to-transparent" />

      <div className="absolute left-4 top-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleZoomIn();
          }}
          aria-label="Увеличить карту"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-panel/80 text-xl leading-none text-sand shadow-lg backdrop-blur transition hover:border-terracotta hover:text-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <span
            className="block -translate-y-px"
            aria-hidden="true"
          >
            +
          </span>
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleZoomOut();
          }}
          aria-label="Уменьшить карту"
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-panel/80 text-xl leading-none text-sand shadow-lg backdrop-blur transition hover:border-terracotta hover:text-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <span
            className="block -translate-y-px"
            aria-hidden="true"
          >
            −
          </span>
        </button>

        <div className="group relative mt-1">
          <span className="pointer-events-none absolute left-[calc(100%+0.6rem)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-line bg-panel px-3 py-2 text-[13px] font-medium text-sand opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:block">
            случайная страна
          </span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleRandomCountry();
            }}
            aria-label="Случайная страна"
            className="map-random-btn flex h-11 w-11 items-center justify-center rounded-lg border border-terracotta/45 bg-panel/90 text-terracotta shadow-lg backdrop-blur transition hover:border-terracotta hover:bg-terracotta/10 hover:text-terracotta-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <svg
              viewBox="0 0 24 24"
              className="map-random-btn__icon h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m18 14 4 4-4 4" />
              <path d="m18 2 4 4-4 4" />
              <path d="M2 18h1.88a6 6 0 0 0 4.62-2.12l8-8A6 6 0 0 1 21.12 6H22" />
              <path d="M2 6h1.88a6 6 0 0 1 4.62 2.12l8 8A6 6 0 0 0 21.12 18H22" />
            </svg>
          </button>
        </div>

        <div className="group relative mt-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setFiltersOpen((open) => !open);
            }}
            aria-label="Фильтры карты"
            aria-expanded={filtersOpen}
            className={`flex h-11 w-11 items-center justify-center rounded-lg border shadow-lg backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
              filtersOpen || activeFilters.length > 0
                ? "border-terracotta bg-terracotta/15 text-terracotta-light"
                : "border-line bg-panel/80 text-sand hover:border-terracotta hover:text-terracotta-light"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 5h16l-6 7.5V19l-4 2v-8.5L4 5z" />
            </svg>
            {activeFilters.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold text-white">
                {activeFilters.length}
              </span>
            )}
          </button>
          {!filtersOpen && (
            <span className="pointer-events-none absolute left-[calc(100%+0.6rem)] top-1/2 z-10 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-line bg-panel px-3 py-2 text-[13px] font-medium text-sand opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100 sm:block">
              фильтры
            </span>
          )}

          {filtersOpen && (
            <div
              className="absolute left-[calc(100%+0.6rem)] top-0 z-30 w-[min(16rem,calc(100vw-5rem))] rounded-xl border border-line bg-panel/95 p-3 shadow-xl backdrop-blur-md"
              onClick={(event) => event.stopPropagation()}
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sand/50">
                Фильтры
              </p>
              <ul className="flex flex-col gap-1.5">
                {MAP_FILTERS.map((filter) => {
                  const checked = activeFilters.includes(filter.id);
                  return (
                    <li key={filter.id}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-sand transition hover:bg-surface-hover">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilter(filter.id)}
                          className="h-4 w-4 accent-[var(--night-sakura,#d56089)]"
                        />
                        <span>{filter.label}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              {activeFilters.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilters([])}
                  className="mt-2 w-full rounded-lg px-2 py-1.5 text-left text-xs text-sand/60 transition hover:bg-surface-hover hover:text-sand"
                >
                  Сбросить
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="absolute right-4 top-4 z-20 flex max-h-[calc(100%-2rem)] flex-col items-end gap-2 overflow-y-auto">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleTemperature();
          }}
          aria-pressed={showTemperature}
          className={`shrink-0 rounded-lg border px-3.5 py-2.5 text-sm font-medium shadow-lg backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
            showTemperature
              ? "border-terracotta bg-terracotta/15 text-terracotta-light"
              : "border-line bg-panel/90 text-sand hover:border-terracotta hover:text-terracotta-light"
          }`}
        >
          {showTemperature
            ? tempLoading
              ? "Загрузка…"
              : "Скрыть температуру"
            : "Показать температуру"}
        </button>

        {showTemperature && (
          <div className="w-[11.5rem] rounded-xl border border-line bg-panel/95 p-3 shadow-xl backdrop-blur-md">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sand/50">
              Температура
            </p>
            {tempLoading && (
              <p className="mb-2 text-xs text-sand/65">Загрузка…</p>
            )}
            {tempError && !tempLoading && (
              <p className="mb-2 text-xs text-terracotta-light">{tempError}</p>
            )}
            <ul className="flex flex-col gap-1.5">
              {TEMP_LEGEND.map((step) => (
                <li
                  key={step.label}
                  className="flex items-center gap-2 text-[12px] text-sand/85"
                >
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-sm border border-black/15"
                    style={{ backgroundColor: step.color }}
                    aria-hidden="true"
                  />
                  <span>{step.label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] leading-snug text-sand/45">
              Текущая температура по координатам стран (Open-Meteo)
            </p>
          </div>
        )}
      </div>

      <div className="absolute bottom-5 left-[6.75rem] right-4 z-20 w-auto max-w-none sm:bottom-7 sm:left-1/2 sm:right-auto sm:w-[calc(100%-2rem)] sm:max-w-[380px] sm:-translate-x-1/2">
        {hoveredCountry && (
          <div className="pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-line bg-ink px-4 py-2.5 text-sm font-medium text-sand sm:block">
            {hoveredCountry}
            {showTemperature &&
              (() => {
                const hovered = findProjectCountry(hoveredCountry);
                const temp =
                  hovered && temperatures[hovered.countryCode];
                return typeof temp === "number" ? (
                  <span className="ml-2 text-sand/70">{temp}°C</span>
                ) : null;
              })()}
          </div>
        )}

        <div className="pointer-events-auto">
          {notice && (
            <p
              role="status"
              className="mb-2 rounded-xl border border-line-strong bg-panel/95 px-4 py-3 text-sm text-sand shadow-xl backdrop-blur-md"
            >
              {notice}
            </p>
          )}

          <label
            htmlFor="country-search"
            className="sr-only"
          >
            Выберите страну
          </label>

          <div className="flex items-center rounded-lg border border-line bg-panel/90 px-4 backdrop-blur-md transition focus-within:border-terracotta focus-within:ring-2 focus-within:ring-terracotta/25">
            <input
              id="country-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" || searchResults.length === 0) {
                  return;
                }

                event.preventDefault();
                handleSearchSelect(searchResults[0]);
              }}
              placeholder="Найти страну в каталоге"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm font-medium text-sand outline-none placeholder:text-sand/60"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Очистить поиск"
                className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sand/65 transition hover:bg-surface-hover hover:text-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
              >
                ×
              </button>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-xl border border-line-strong bg-panel/95 shadow-xl backdrop-blur-md">
              {searchResults.map((country) => (
                <button
                  key={country.slug}
                  type="button"
                  onClick={() => handleSearchSelect(country)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-sand transition hover:bg-terracotta/15 hover:text-terracotta-light focus-visible:bg-terracotta/15 focus-visible:outline-none"
                >
                  <span>{country.name}</span>

                  <span
                    className="text-sand/45"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </button>
              ))}
            </div>
          )}

          {search.trim().length > 0 && searchResults.length === 0 && (
            <p className="mt-2 rounded-xl border border-line-strong bg-panel/95 px-4 py-3 text-sm text-sand/75 shadow-xl backdrop-blur-md">
              В каталоге пока нет такой страны.
            </p>
          )}
        </div>
      </div>

      {selectedCountry && (
        <>
          <button
            type="button"
            aria-label="Закрыть карточку страны"
            onClick={closeCountryCard}
            className="fixed inset-0 z-30 bg-ink/45 backdrop-blur-[2px] md:hidden"
          />

          <div
            className="absolute inset-x-3 bottom-3 z-40 max-h-[calc(100dvh-96px)] overflow-hidden overflow-y-auto rounded-xl border border-line bg-panel text-sand shadow-elevated backdrop-blur-md md:hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <CountryCardContent
              country={selectedCountry}
              onClose={closeCountryCard}
              compact
            />
          </div>

          {cardPosition && (
            <div
              role="dialog"
              aria-label={`Информация о стране ${selectedCountry.name}`}
              tabIndex={0}
              className={`absolute z-40 hidden w-[350px] max-w-[calc(100%-48px)] overflow-hidden rounded-xl border border-line bg-panel text-sand shadow-elevated backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light md:block ${
                isCardDragging
                  ? "cursor-grabbing select-none"
                  : "cursor-grab"
              }`}
              style={{
                left: `${cardPosition.left}px`,
                top: `${cardPosition.top}px`,
                maxHeight: `calc(100% - ${MAP_EDGE_PADDING * 2}px)`,
                touchAction: "none",
              }}
              onClick={(event) => event.stopPropagation()}
              onPointerDown={handleCardDragStart}
              onPointerMove={handleCardDragMove}
              onPointerUp={handleCardDragEnd}
              onPointerCancel={handleCardDragEnd}
              onKeyDown={handleCardKeyDown}
            >
              <div className="max-h-[calc(100vh-48px)] overflow-y-auto">
                <CountryCardContent
                  country={selectedCountry}
                  onClose={closeCountryCard}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

type CountryCardContentProps = {
  country: Country;
  onClose: () => void;
  compact?: boolean;
};

function CountryCardContent({
  country,
  onClose,
  compact = false,
}: CountryCardContentProps) {
  return (
    <div className="overflow-hidden bg-panel text-sand ring-1 ring-[var(--line)]">
      <div className="relative h-36 overflow-hidden md:h-36">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={country.imageUrl}
          alt={country.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel)] via-[#0e0b14]/40 to-transparent" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть карточку страны"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg border border-line-strong bg-[#0e0b14]/80 text-lg leading-none text-white transition hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light"
        >
          ×
        </button>

        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-sand/80">
            {country.region}
          </span>
        </div>
      </div>

      <div className={`bg-panel ${compact ? "p-4" : "p-5"}`}>
        <h3
          className={`font-heading font-normal leading-none tracking-tight text-sand ${
            compact ? "text-[1.7rem]" : "text-[2rem]"
          }`}
        >
          {country.name}
        </h3>

        <p className="mt-3 text-[15px] leading-6 text-sand/75">
          {country.description}
        </p>

        <p className="mt-3 text-[13px] tracking-wide text-sage">
          {country.highlights.slice(0, 3).join(" · ")}
        </p>

        <Link
          href={`/countries/${country.slug}`}
          className="mt-5 flex min-h-11 items-center justify-center rounded-lg bg-terracotta px-4 py-3 text-center text-sm font-semibold leading-none text-white transition hover:bg-terracotta-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-light focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Перейти к стране
          <span
            className="ml-2 text-lg"
            aria-hidden="true"
          >
            →
          </span>
        </Link>
      </div>
    </div>
  );
}