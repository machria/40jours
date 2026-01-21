'use client';

import { useEffect, useRef } from 'react';

interface UseScrollPersistenceProps {
    /** unique key for localStorage */
    storageKey: string;
    /** selector to identify trackable elements (e.g. '[data-ayah-id]') */
    selector: string;
    /** boolean to enable/disable (e.g. wait for data loading) */
    enabled?: boolean;
}

export function useScrollPersistence({ storageKey, selector, enabled = true }: UseScrollPersistenceProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const isRestoredRef = useRef(false);

    // RESTORE SCROLL POSITION
    useEffect(() => {
        if (!enabled || isRestoredRef.current) return;

        const lastId = localStorage.getItem(storageKey);
        if (lastId) {
            // Try to find the element
            // We use a slight timeout to allow the DOM to settle if needed, 
            // though 'enabled' should ideally be true only when DOM is ready.
            const attemptScroll = () => {
                const element = document.getElementById(lastId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    isRestoredRef.current = true;
                }
            };

            // Attempt immediately
            attemptScroll();

            // And retry briefly in case of hydration/render delays
            const timer = setTimeout(attemptScroll, 100);
            return () => clearTimeout(timer);
        }
    }, [storageKey, enabled]);

    // TRACK SCROLL POSITION
    useEffect(() => {
        if (!enabled) return;

        // Cleanup previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Create new observer
        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Find the entry that is most visible
                // We actually just want to save ANY visible ayah, 
                // preferably the one closest to the top of the viewport.
                // But IntersectionObserver gives us ALL changes.

                // Let's filter for intersecting entries
                const visible = entries.filter(e => e.isIntersecting);

                if (visible.length > 0) {
                    // Sort by intersection ratio or simple order?
                    // Let's pick the first one that is visible. 
                    // A better logic might be to debounce this and check `document.elementFromPoint`?
                    // Or rely on the fact that we observe many.

                    // Simple heuristic: Save the ID of the first intersecting element in the list provided by observer
                    // Usually this corresponds to scrolling action.

                    const target = visible[0].target;
                    if (target.id) {
                        localStorage.setItem(storageKey, target.id);
                    }
                }
            },
            {
                root: null, // viewport
                rootMargin: '-40% 0px -40% 0px', // Active only in the middle 20% of screen to avoid jitter
                threshold: 0
            }
        );

        // Attach observer to elements
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => observerRef.current?.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [storageKey, selector, enabled]);

    return {};
}
