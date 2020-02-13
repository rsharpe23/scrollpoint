import $ from 'jquery';
// import ScrollPoint from './scrollpoint';
import FullPageScrollPoint from './fullpage-scrollpoint';

const DATA_KEY = 'rsh.scrollpoint';

// Здесь используется функциональное выражение вместо
// стрелочной функций, т.к. та не имеет своего this
$.fn.scrollpoint = function (options) {
  return this.each((index, element) => {
    const $element = $(element);
    let instance = $element.data(DATA_KEY);

    if (!instance) {
      $element.data(
        DATA_KEY,
        instance = new FullPageScrollPoint($element)
      );
    }

    instance.addListener(options);
  });
};