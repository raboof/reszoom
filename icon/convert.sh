#!/bin/sh

convert icon.xcf icon128.png
convert icon.xcf -scale 48x48 icon48.png
convert icon.xcf -scale 32x32 icon32.png
convert icon.xcf -scale 16x16 icon16.png

