import $ from 'jquery';
import ScrollPointListener from './scrollpoint-listener';

class ScrollPoint {
  constructor($element) {
    this.$element = $element;
    this.listeners = [];
    $(window).on('scroll resize', this._execute.bind(this));
  }

  refresh() {
    this._execute();
  }

  // _execute() {
  //   const DOMRect = this.$element[0].getBoundingClientRect();

  //   if (this._DOMRect) {
  //     const wHeight = window.innerHeight;
  //     const data = { scrollDelta: this._DOMRect.top - DOMRect.top };

  //     this.listeners.forEach((listener, index) => {
  //       const offset = listener.calcOffset(wHeight);

  //       // Устанавлить offset стоит только для верхней стороны, 
  //       // иначе на маленьких элементах будет неправильный расчет соотношений.
  //       if ((DOMRect.top + offset) < wHeight && (DOMRect.top + DOMRect.height) > 0) {
  //         listener.triggerAll(['enter', 'stay'], data);
  //       } else {
  //         if (listener.trigger('exit', data) && listener.options.once) {
  //           // HACK: Т.к. метод вызывается в процессе цикла,
  //           // необходимо чтобы текущий listener удалялся после его завершения.
  //           // setTimeout(..., 0) вызывает переданную функцию только
  //           // после завершения выполнения текущего кода.
  //           setTimeout(() => this.listeners.splice(index, 1));
  //         }
  //       }
  //     });
  //   }

  //   this._DOMRect = DOMRect;
  // }

  _execute() {
    const DOMRect = this.$element[0].getBoundingClientRect();
    const wHeight = window.innerHeight;

    const data = { 
      scrollDelta: this._DOMRect 
        ? this._DOMRect.top - DOMRect.top : 0,
    };

    this.listeners.forEach((listener, index) => {
      const offset = listener.calcOffset(wHeight);

      // Устанавлить offset стоит только для верхней стороны, 
      // иначе на маленьких элементах будет неправильный расчет соотношений.
      if ((DOMRect.top + offset) < wHeight && (DOMRect.top + DOMRect.height) > 0) {
        listener.triggerAll(['enter', 'stay'], data);
      } else {
        if (listener.trigger('exit', data) && listener.options.once) {
          // HACK: Т.к. метод вызывается в процессе цикла,
          // необходимо чтобы текущий listener удалялся после его завершения.
          // setTimeout(..., 0) вызывает переданную функцию только
          // после завершения выполнения текущего кода.
          setTimeout(() => this.listeners.splice(index, 1));
        }
      }
    });

    this._DOMRect = DOMRect;
  }

  addListener(options) {
    this.listeners.push(
      new ScrollPointListener(this, options)
    );
  }
}

export default ScrollPoint;