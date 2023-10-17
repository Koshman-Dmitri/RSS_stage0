class GuessingGame {
    prom = null;
  
    constructor(min, max) {
      this.min = null;
      this.max = null;
    }

    setRange(min, max) {
      this.min = min;
      this.max = max;
    }

    guess() {
      this.prom = Math.ceil((this.min + this.max) / 2);
      return this.prom;
    }

    lower() {
      this.max = this.prom;
    }

    greater() {
      this.min = this.prom;
    }
}