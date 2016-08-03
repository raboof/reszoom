all: zip

zip: background.js manifest.json icon/icon*.png
	@-rm reszoom.zip
	zip reszoom.zip $^
