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
    var spriter = null;

    for (var file in this.files) {
      if (fs.existsSync(file)) {
        (spriter || (spriter = new SVGSpriter(this.config))).add(path.resolve(file), null, this.files[file]);
      } else {
        delete this.files[file];
        // Force compilation
        this.dirty = true;
      }
    }

    if (spriter && this.dirty) {
      spriter.compile(function(error, result) {
        for (var mode in result) {
          for (var resource in result[mode]) {
            mkdirp.sync(path.dirname(result[mode][resource].path));
            fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
          }
        }
      });
    } else if (this.dirty) {
      // There are no SVG files, remove sprite
      var symbol = this.config.mode.symbol;
      var file = path.resolve(symbol.dest, symbol.sprite);
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } else {
      return;
    }

    this.dirty = false;
  }
}

SvgSpriteCompiler.prototype.brunchPlugin = true;
SvgSpriteCompiler.prototype.type = 'template';
SvgSpriteCompiler.prototype.extension = 'svg';

module.exports = SvgSpriteCompiler;
