require('browsernizr/lib/prefixed');
var Modernizr = require('browsernizr');

const defaultEventFailureGracePeriod = 100;

module.exports = (element, expectedDuration, callback, eventFailureGracePeriod) =>
  new Promise(resolve => {
    const transitionend = getTransitionEndEvent();
    const gracePeriod = eventFailureGracePeriod !== undefined ?
      eventFailureGracePeriod :
      defaultEventFailureGracePeriod;
    let done = false;
    let forceEnd = false;

    element.addEventListener(transitionend, onTransitionEnd);

    setTimeout(() => {
      if (!done) {
        // forcing onTransitionEnd callback...
        forceEnd = true;
        onTransitionEnd();
      }
    }, expectedDuration + gracePeriod);

    function onTransitionEnd(e) {
      if (forceEnd || e.target === element) {
        done = true;
        element.removeEventListener(transitionend, onTransitionEnd);
        resolve(e);
        if (callback) { callback(e); }
      }
    }
  });

const getTransitionEndEvent = (() => {
  let transitionEndEvent = null;
  return () =>
    transitionEndEvent || (transitionEndEvent = ({
      transition: 'transitionend',
      OTransition: 'otransitionend',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd'
    })[ Modernizr.prefixed('transition') ]);
})();