import $ from 'jquery';
import ScrollPoint from './scrollpoint';

class FullPageScrollPoint extends ScrollPoint {
  constructor(...args) {
    super(...args); // super() должен вызываться перед первым this

    // Подписываться на this.$element неверно, т.к.
    // scrollPoint может быть не только экран но элемент внутри экрана.
    $('.fp-container:first')
      .on('fullpagescroll', this._execute.bind(this));
  }
}

export default FullPageScrollPoint;