import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import type { Candle } from '../utils/data';
import { useTheme } from '../contexts/ThemeContext';
import { BarChart3, TrendingUp } from 'lucide-react';

interface ChartProps {
  data: Candle[];
  zoom?: number;
}

export const Chart: React.FC<ChartProps> = ({ data, zoom = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(400);
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(false);
  const { resolvedTheme } = useTheme();

  // Theme-aware colors
  const isDark = resolvedTheme === 'dark';
  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    backgroundOverlay: isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    gridLine: isDark ? '#333333' : '#F2F2F2',
    labelText: isDark ? '#707070' : '#8E8E93',
    candleUp: '#22c55e',
    candleDown: '#ef4444',
  };

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
  const paddingLeft = 48; // Space for Y-Axis
  const paddingRight = 20;
  const paddingTop = 20;
  const volumeHeight = showVolume ? 80 : 0; // Height reserved for volume bars
  const paddingBottom = 40 + volumeHeight; // Extra room for scrollbar + volume

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

  // Volume calculations
  const maxVolume = showVolume ? Math.max(...data.map(d => d.volume || 0)) : 0;
  const getVolumeHeight = (volume: number) => {
    if (!maxVolume || !volume) return 0;
    return (volume / maxVolume) * (volumeHeight - 10);
  };

  // MA calculations
  const calculateMA = (period: number): number[] => {
    const ma: number[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        ma.push(NaN);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
        ma.push(sum / period);
      }
    }
    return ma;
  };

  const ma20 = showMA ? calculateMA(20) : [];
  const ma50 = showMA ? calculateMA(50) : [];

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
        background: colors.background,
        borderRadius: '12px',
        padding: '10px 10px 0 5px', /* Reduced left padding for more chart space */
        position: 'relative',
        display: 'flex',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* MA Legend */}
      {showMA && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '60px',
          zIndex: 15,
          display: 'flex',
          gap: '12px',
          background: colors.backgroundOverlay,
          border: `1px solid ${colors.gridLine}`,
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '11px',
          fontWeight: '600'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '16px', height: '2px', background: '#3B82F6' }}></div>
            <span style={{ color: colors.labelText }}>MA20</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '16px', height: '2px', background: '#F97316' }}></div>
            <span style={{ color: colors.labelText }}>MA50</span>
          </div>
        </div>
      )}

      {/* MA Toggle Button */}
      <button
        onClick={() => setShowMA(!showMA)}
        style={{
          position: 'absolute',
          bottom: '92px',
          left: '8px',
          zIndex: 20,
          background: showMA ? '#FFBF00' : colors.backgroundOverlay,
          border: `1px solid ${showMA ? '#FFBF00' : colors.gridLine}`,
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          color: showMA ? '#1A1A1A' : colors.labelText
        }}
        title={showMA ? 'Hide MA' : 'Show MA (20/50)'}
      >
        <TrendingUp size={18} />
      </button>

      {/* Volume Toggle Button */}
      <button
        onClick={() => setShowVolume(!showVolume)}
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '8px',
          zIndex: 20,
          background: showVolume ? '#FFBF00' : colors.backgroundOverlay,
          border: `1px solid ${showVolume ? '#FFBF00' : colors.gridLine}`,
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          color: showVolume ? '#1A1A1A' : colors.labelText
        }}
        title={showVolume ? 'Hide Volume' : 'Show Volume'}
      >
        <BarChart3 size={18} />
      </button>
      {/* Fixed Y-Axis */}
      <div style={{
        width: `${paddingLeft}px`,
        height: `${height}px`,
        position: 'absolute',
        top: '0',
        left: '5px',
        background: colors.backgroundOverlay,
        zIndex: 10,
        borderRight: `1px solid ${colors.gridLine}`,
        pointerEvents: 'none',
        transition: 'background-color 0.3s ease, border-color 0.3s ease'
      }}>
        <svg width="100%" height="100%">
          {yLabels.map((label, i) => (
            <text
              key={i}
              x={paddingLeft - 8}
              y={label.y}
              textAnchor="end"
              alignmentBaseline="middle"
              fill={colors.labelText}
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
              stroke={colors.gridLine}
              strokeWidth="1"
            />
          ))}

          {/* MA Lines */}
          {showMA && ma20.length > 0 && (
            <path
              d={ma20.map((price, i) => {
                if (isNaN(price)) return '';
                const x = getX(i) + candleBodyWidth / 2;
                const y = getY(price);
                return i === 0 || isNaN(ma20[i - 1]) ? `M ${x} ${y}` : `L ${x} ${y}`;
              }).join(' ')}
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
          )}
          {showMA && ma50.length > 0 && (
            <path
              d={ma50.map((price, i) => {
                if (isNaN(price)) return '';
                const x = getX(i) + candleBodyWidth / 2;
                const y = getY(price);
                return i === 0 || isNaN(ma50[i - 1]) ? `M ${x} ${y}` : `L ${x} ${y}`;
              }).join(' ')}
              stroke="#F97316"
              strokeWidth="2"
              fill="none"
              opacity="0.8"
            />
          )}

          {/* Candles */}
          {data.map((d, i) => {
            const x = getX(i);
            const isUp = d.close >= d.open;
            const color = isUp ? colors.candleUp : colors.candleDown;

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

          {/* Volume Bars */}
          {showVolume && data.map((d, i) => {
            if (!d.volume) return null;
            const x = getX(i);
            const isUp = d.close >= d.open;
            const color = isUp ? colors.candleUp : colors.candleDown;
            const barHeight = getVolumeHeight(d.volume);
            const volumeY = height - 40;

            return (
              <rect
                key={`vol-${d.time}-${i}`}
                x={x}
                y={volumeY - barHeight}
                width={candleBodyWidth}
                height={barHeight}
                fill={color}
                opacity={0.4}
                rx="1"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
};
