#!/bin/bash

DEST=../nerdshow@gh-pages
RT=rt

# generate slides for gh-pages and copy to branch
bin/nerdshow-generate examples/about/presentation.json --nerdshow-folder $RT --no-socketio-enabled --no-zoom-enabled

cp -ru examples/about/* $DEST/

# recreate slides for node.js demo
bin/nerdshow-generate examples/about/presentation.json

# copy / update runtime
mkdir -p $DEST/$RT
cp -ru lib/server/htdocs/* $DEST/$RT/

