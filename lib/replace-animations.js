var ignoreComments = require('./regex').ignoreComments;
var css = require('css');

module.exports = replaceAnimations;

function replaceAnimations(result) {
  var animations = Object.keys(result.keyframes).reduce(function(acc, key) {
    acc[result.keyframes[key]] = key;
    return acc;
  }, {});
  var unscoped = Object.keys(animations);

  if (unscoped.length) {
    const ast = css.parse(result.css);

    ast.stylesheet.rules
      .filter(rule => Array.isArray(rule.declarations))
      .forEach(rule => rule.declarations
        .filter(declaration => declaration.type === 'declaration')
        .forEach(mapAnimationNames(animations))
      );

    return {
      css: css.stringify(ast),
      keyframes: result.keyframes,
      classes: result.classes
    };
  }

  return result;
}

function mapAnimationNames(animations) {
  return function(declaration) {
    const values = declaration.value.split(',');
    const property = declaration.property;

    if (property === 'animation') {
      declaration.value = updateAnimation(values, animations).join(',');
    } else if (property === 'animation-name') {
      declaration.value = values.map(value => animations[value.trim()]).join(', ');
    }
  };
}

function updateAnimation(values, animations) {
  return Object.keys(animations)
    .map(key => {
      const regexp = new RegExp(key + '( .*)', 'g');

      return values
        .filter(value => regexp.test(value))
        .map(value => value.replace(regexp, animations[key] + '$1'));
    })
    .filter(value => value.length);
}
