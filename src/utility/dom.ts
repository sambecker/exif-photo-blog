export const isElementEntirelyInViewport = (
  element?: HTMLElement | null,
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
        window.innerWidth || document.documentElement.clientWidth
      )
    );
  } else {
    return false;
  }
};

export const clearGlobalFocus = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
