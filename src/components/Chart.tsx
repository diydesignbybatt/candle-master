import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import type { Candle } from '../utils/data';

interface ChartProps {
  data: Candle[];
  zoom?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, zoom = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(400);

  // Measure container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setChartHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Auto-scroll to the end when data updates (new candle added)
  useLayoutEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [data.length]);

  if (data.length === 0) return null;

  // Use dynamic chartHeight instead of fixed 400
  const height = chartHeight;
  const candleTypeWidth = 12 * zoom; // Width per candle scales with zoom
  const gap = 4 * zoom; // Gap also scales with zoom
  const candleStride = candleTypeWidth + gap;

  // Padding for axes
  const paddingLeft = 60; // Space for Y-Axis
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40; // Extra room for scrollbar

  // Total width grows with data
  const chartAreaWidth = data.length * candleStride;
  const totalWidth = chartAreaWidth + paddingLeft + paddingRight;

  const minLow = Math.min(...data.map(d => d.low)) * 0.999;
  const maxHigh = Math.max(...data.map(d => d.high)) * 1.001;
  const range = maxHigh - minLow;

  const getY = (price: number) => {
    if (range === 0) return height / 2;
    return height - paddingBottom - ((price - minLow) / range) * (height - paddingTop - paddingBottom);
  };
  const getX = (index: number) => paddingLeft + index * candleStride;

  const candleBodyWidth = 8 * zoom; // Body width scales with zoom

  const yLabels = [0, 0.25, 0.5, 0.75, 1].map(p => {
    const price = minLow + p * range;
    const y = getY(price);
    return { price: price.toLocaleString(undefined, { maximumFractionDigits: 2 }), y };
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '200px', /* Ensure it never collapses completely */
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '10px 10px 0 10px', /* Remove bottom padding to let scrollbar sit flush */
        position: 'relative',
        display: 'flex',
        overflow: 'hidden'
      }}
    >
      {/* Fixed Y-Axis */}
      <div style={{
        width: `${paddingLeft}px`,
        height: `${height}px`,
        position: 'absolute',
        top: '0',
        left: '10px',
        background: 'rgba(255, 255, 255, 0.95)',
        zIndex: 10,
        borderRight: '1px solid #F2F2F2',
        pointerEvents: 'none'
      }}>
        <svg width="100%" height="100%">
          {yLabels.map((label, i) => (
            <text
              key={i}
              x={paddingLeft - 8}
              y={label.y}
              textAnchor="end"
              alignmentBaseline="middle"
              fill="#8E8E93"
              fontSize="10px"
              fontFamily="Nunito, sans-serif"
              fontWeight="600"
            >
              {label.price}
            </text>
          ))}
        </svg>
      </div>

      {/* Scrollable Area */}
      <div
        ref={scrollContainerRef}
        style={{
          width: '100%',
          height: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          paddingBottom: '10px' // Space for scrollbar inside content
        }}
      >
        <svg width={totalWidth} height={height}>
          {/* Grid lines */}
          {yLabels.map((label, i) => (
            <line
              key={i}
              x1={paddingLeft}
              y1={label.y}
              x2={totalWidth - paddingRight}
              y2={label.y}
              stroke="#F2F2F2"
              strokeWidth="1"
            />
          ))}

          {/* Candles */}
          {data.map((d, i) => {
            const x = getX(i);
            const isUp = d.close >= d.open;
            const color = isUp ? '#00D293' : '#FF5A5F'; // Matching the new K-App Theme

            return (
              <g key={`${d.time}-${i}`}>
                <line
                  x1={x + candleBodyWidth / 2}
                  y1={getY(d.high)}
                  x2={x + candleBodyWidth / 2}
                  y2={getY(d.low)}
                  stroke={color}
                  strokeWidth="1.5"
                />
                <rect
                  x={x}
                  y={getY(Math.max(d.open, d.close))}
                  width={candleBodyWidth}
                  height={Math.max(1, Math.abs(getY(d.open) - getY(d.close)))}
                  fill={color}
                  rx="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
