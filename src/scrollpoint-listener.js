class ScrollPointListener {
  constructor(sPoint, options) {
    this.sPoint = sPoint;
    this.options = options;
    this._eventAccess = 1;
  }

  triggerAll(events, data) {
    events.forEach(event => this.trigger(event, data));
  }

  trigger(event, data) {
    const success = this._tryAccessEvent(event);

    if (success) {
      this.options[event] && this.options[event]
        .call(this.sPoint.$element[0], data);
    }

    return success;
  }

  _tryAccessEvent(event) {
    if (event == 'stay') {
      return true;
    }

    if (event == 'enter' || event == 'exit') {
      const isEntry = (event == 'enter');

      let newEventAccess = isEntry ? this._eventAccess
        : ~this._eventAccess;

      newEventAccess &= 1;

      if (newEventAccess) {
        isEntry ? (this._eventAccess <<= 1)
          : (this._eventAccess >>>= 1);
      }

      return !!newEventAccess;
    }

    return false;
  }

  calcOffset(height) {
    let offset = this.options.offset || 0;

    if (typeof offset == 'string') {
      offset = parseInt(offset);
    }

    return height * offset * 0.01;
  }
}

export default ScrollPointListener;