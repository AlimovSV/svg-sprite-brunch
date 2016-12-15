'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const SVGSpriter = require('svg-sprite');

class SvgSpriteCompiler {
  constructor(config) {
    this.config = config.plugins.svgsprite;
    this.files = {};
    this.dirty = false;
  }

  compile(file) {
    this.dirty = true;
    this.files[file.path] = file.data;
    return Promise.resolve({data: ''});
  }

  onCompile(files) {
    if (!this.dirty) {
      return;
    }

    var spriter = null;

    for (var file in this.files) {
      if (fs.existsSync(file)) {
        (spriter || (spriter = new SVGSpriter(this.config))).add(path.resolve(file), null, this.files[file]);
      }
    }

    spriter && spriter.compile(function(error, result) {
      for (var mode in result) {
        for (var resource in result[mode]) {
          mkdirp.sync(path.dirname(result[mode][resource].path));
          fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
        }
      }
    });
  }
}

SvgSpriteCompiler.prototype.brunchPlugin = true;
SvgSpriteCompiler.prototype.type = 'template';
SvgSpriteCompiler.prototype.extension = 'svg';

module.exports = SvgSpriteCompiler;
