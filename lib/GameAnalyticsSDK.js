class GameAnalyticsSDK{constructor(){this.listeners={},this.setupMessageListener(),this.setupFlutterListener()}getMobileOperatingSystem(){const e=navigator.userAgent||navigator.vendor||window.opera;return/android/i.test(e)?"Android":/iPad|iPhone|iPod/.test(e)&&!window.MSStream?"iOS":"Browser"}sendMessageForAnalytics(e,t){const r=this.getMobileOperatingSystem(),s=JSON.stringify(t);switch(r){case"Android":try{console.log(`Android - ${e} called`,s),window.parent.postMessage({eventName:e,data:s},"*"),window.flutter_inappwebview?window.flutter_inappwebview.callHandler(e,s):JSBridge[e](s)}catch(e){console.error(`Android JS Bridge error: ${e}`)}break;case"iOS":try{console.log(`iOS - ${e} called`,s),window.parent.postMessage({eventName:e,data:s},"*");const t={[e]:s};window.flutter_inappwebview?window.flutter_inappwebview.callHandler(e,JSON.stringify(t)):window.webkit.messageHandlers.jsHandler.postMessage(JSON.stringify(t))}catch(e){console.error(`iOS JS Bridge error: ${e}`)}break;default:try{console.log(`Browser - ${e} called`,s),window.parent.postMessage({eventName:e,data:s},"*"),window.flutter_inappwebview&&window.flutter_inappwebview.callHandler(e,s)}catch(e){console.error(`Browser JS Bridge error: ${e}`)}}}emit(e,t){console.log(`${e} =====> ${JSON.stringify(t)}`),this.sendMessageForAnalytics(e,t)}listen(e,t){this.listeners[e]||(this.listeners[e]=[]),this.listeners[e].push((r=>{try{const e="string"==typeof r?JSON.parse(r):r;t(e)}catch(t){console.error(`Error parsing data for event "${e}":`,t)}}))}trigger(e,t){this.listeners[e]&&this.listeners[e].forEach((e=>e(t)))}setupMessageListener(){window.addEventListener("message",(e=>{const{eventName:t,data:r}=e.data||{};if(t&&this.listeners[t])try{const e="string"==typeof r?JSON.parse(r):r;console.log(`Received data from message listener: ${t} -`,e),this.trigger(t,e)}catch(e){console.error(`Error parsing incoming message data for event "${t}":`,e)}}))}setupFlutterListener(){window.flutter_inappwebview?(console.log("Flutter WebView is ready."),window.flutter_inappwebview.callHandler("JSReady",{status:"JS SDK Ready"}),window.addEventListener("flutterInAppWebViewPlatformReady",(()=>{console.log("Flutter WebView Platform is ready.")}))):console.warn("Flutter WebView is not detected."),window.addEventListener("message",(e=>{const{eventName:t,data:r}=e.data||{};if(t&&this.listeners[t])try{const e="string"==typeof r?JSON.parse(r):r;console.log(`Received data from Flutter: ${t} -`,e),this.trigger(t,e)}catch(e){console.error(`Error parsing data from Flutter for event "${t}":`,e)}}))}}export const GameAnalytics=new GameAnalyticsSDK;