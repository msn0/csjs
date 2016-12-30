const csjs = require('../');

module.exports = csjs`

  .foo {
    animation: keyframe-1 1s ease-in-out, keyframe-2 .5s linear;
  }
  
  .bar {
    animation-name: keyframe-1, keyframe-2;
  }
  
  @keyframes keyframe-1 {}
  @keyframes keyframe-2 {}

`;
