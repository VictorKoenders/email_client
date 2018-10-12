node node_modules/protobufjs/bin/pbjs -t static-module -o src/protobuf_compiled.js -p ../proto entry.proto
node node_modules/protobufjs/bin/pbts -o src/protobuf_compiled.d.ts src/protobuf_compiled.js
