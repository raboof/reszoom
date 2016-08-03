all: zip overview.png

zip: background.js manifest.json icon/icon*.png
	@-rm reszoom.zip
	zip reszoom.zip $^

overview.png: overview.xcf
	convert overview.xcf -flatten overview.png
