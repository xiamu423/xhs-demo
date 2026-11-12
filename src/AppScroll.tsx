import {useSyncExternalStore, type ComponentProps} from 'react';
import {MobileScroll, Carousel} from './mobile';

const query = '(max-width:600px)';
const subscribe = (notify:()=>void) => {
  const media = matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};
export function useNativeViewport() {
  return useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false);
}

/** Real phones use browser scrolling; simulated inertia belongs only to the desktop preview. */
export function AppScroll({className, children}:ComponentProps<typeof MobileScroll>) {
  const native = useNativeViewport();
  if (!native) return <MobileScroll className={className}>{children}</MobileScroll>;
  return <section className={`mobile-page native-page ${className ?? ''}`}>
    <div className="mobile-scroll native-scroll" data-testid="mobile-scroll">
      <div className="mobile-scroll-content" data-testid="mobile-scroll-content">{children}</div>
    </div>
  </section>;
}

export function AppCarousel(props:ComponentProps<typeof Carousel>) {
  const native = useNativeViewport();
  return <Carousel {...props} key={native ? 'native' : 'preview'} draggingEnabled={!native && props.draggingEnabled !== false}/>;
}
