const { performance } = window;

class PerformanceHelper {
  constructor() {
    this._startKey = 'start';
    this._endKey = 'end';
    this._lastDiff = null;
  }

  get lastDiff() {
    return this._lastDiff;
  }

  start() {
    performance.clearMarks();
    performance.clearMeasures();
    performance.mark(this._startKey);
  }

  /**
   * @return {module:perf_hooks.PerformanceEntry | *}
   */
  stop() {
    performance.mark(this._endKey);
    performance.measure('performanceMeasure', this._startKey, this._endKey);
    this._lastDiff = performance.getEntriesByType('measure')[0];
    performance.clearMarks();
    performance.clearMeasures();
    return this._lastDiff;
  }
}

const performanceHelper = new PerformanceHelper();

export default performanceHelper;
