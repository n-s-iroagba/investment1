'use client';

import React, { useEffect, useRef } from 'react';

const TradingViewWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.async = true;
    script.type = 'text/javascript';

    script.textContent = JSON.stringify({
      symbols: [["BITSTAMP:BTCUSD|1D"]],
      chartOnly: true,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: "light",
      gridLineColor: "rgba(46, 46, 46, 0.06)",
      fontColor: "rgb(106, 109, 120)",
      isTransparent: false,
      autosize: false,
      showVolume: true,
      lineWidth: 2,
      lineType: 0,
      chartType: "area",
      volumeUpColor: "rgba(34, 171, 148, 0.5)",
      volumeDownColor: "rgba(247, 82, 95, 0.5)",
      upColor: "#22ab94",
      downColor: "#f7525f",
      borderUpColor: "#22ab94",
      borderDownColor: "#f7525f",
      wickUpColor: "#22ab94",
      wickDownColor: "#f7525f",
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default TradingViewWidget;
