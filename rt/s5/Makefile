SCSS_FILES=$(wildcard ui/*/theme.scss)
CSS_FILES=$(SCSS_FILES:scss=css)
COMMON_SCSS_FILES=$(wildcard ui/common/*.scss)


all: $(CSS_FILES)

clean:
	rm -f $(CSS_FILES)

ui/%/theme.css: ui/%/theme.scss $(COMMON_SCSS_FILES)
	sass -C -t compressed $< > $@
