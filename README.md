# svg-sprite-brunch
Adds [svg-sprite](https://github.com/jkphl/svg-sprite) support to [brunch](http://brunch.io).

## Usage
Install the plugin via npm with `npm install --save-dev svg-sprite-brunch`.

Or, do manual install:

* Add `"svg-sprite-brunch": "x.y.z"` to `package.json` of your brunch app.
  Pick a plugin version that corresponds to your minor (y) brunch version.
* If you want to use git version of plugin, add
`"svg-sprite-brunch": "https://github.com/AlimovSV/svg-sprite-brunch.git"`.

### Options

```javascript
module.exports = {
  conventions: {
    // Source SVG files should be placed under assets.
    assets: /^(web\/static\/assets\/(?!svg))/
  },
}
```

To pass any other options to svg-sprite:

```javascript
module.exports = {
  plugins: {
    svgsprite: {
      mode: {
        symbol: { dest: './priv/static', sprite: 'img/sprite.svg' }
      }
    }
  }
}
```
