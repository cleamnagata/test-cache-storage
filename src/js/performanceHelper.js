const { performance } = window;

class PerformanceHelper {
  constructor() {
    this._startKey = 'start';
    this._endKey = 'end';
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
    performance.measure('deleteTime', this._startKey, this._endKeyKey);
    const diff = performance.getEntriesByType('measure')[0];
    performance.clearMarks();
    performance.clearMeasures();
    return diff;
  }
}

const performanceHelper = new PerformanceHelper();

export default performanceHelper;
