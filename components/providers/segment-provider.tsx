"use client";

import Script from "next/script";

export default function SegmentProvider() {
  const segmentKey = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

  if (!segmentKey) return null;

  return (
    <Script
      id="segment-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(){
            var analytics=window.analytics=window.analytics||[];
            if(!analytics.initialize)
            if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");
            else{
              analytics.invoked=!0;
              analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];
              analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};
              for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}
              analytics.load=function(t){
                var e=document.createElement("script");
                e.type="text/javascript";
                e.async=!0;
                e.src="https://cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
                var n=document.getElementsByTagName("script")[0];
                n.parentNode.insertBefore(e,n)
              };
              analytics.SNIPPET_VERSION="4.15.3";
              analytics.load("${segmentKey}");
              analytics.page();
            }
          }();
        `,
      }}
    />
  );
}
