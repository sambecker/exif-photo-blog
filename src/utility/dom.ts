export const isElementEntirelyInViewport = (
  element?: Element | null,
) => {
  if (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (
        window.innerHeight || 
        document.documentElement.clientHeight
      ) &&
      rect.right <= (
        window.innerWidth ||
        document.documentElement.clientWidth
      )
    );
  } else {
    return false;
  }
};

export function isElementPartiallyInViewport(
  element?: Element | null,
  // Expand the viewport by `offset` pixels (negative offset = stricter)
  offset = 0,
): boolean {
  if (element) {
    const rect = element.getBoundingClientRect();

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth  || document.documentElement.clientWidth;
  
    const topVisible    = rect.bottom >= -offset;
    const leftVisible   = rect.right  >= -offset;
    const bottomVisible = rect.top    <= vh + offset;
    const rightVisible  = rect.left   <= vw + offset;
  
    return topVisible && leftVisible && bottomVisible && rightVisible;
  } else {
    return false;
  }
}

export const clearGlobalFocus = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
