# reszoom

Chrome extension to automatically adjust page zoom settings based on screen resolution

Currently, it will decide between 'high-resolution' and 'low-resolution' by checking if the screen is wider than 2800 pixels. If so, pages at zoom levels 100% or 200% will be automatically set to 100% for normal-DPI screens, and 200% for high-DPI screens.

## Known problems

Because of a [limitiation in chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=627830) the zoom level might not be updated immediately, but after a change in focus or tabs.
