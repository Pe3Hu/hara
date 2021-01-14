//
class hypothesis {
  constructor ( length, alternatives, successes ){
    this.const = {
      length: length
    };
    this.var = {
    };
    this.array = {
      alternative: alternatives,
      success: successes
    };
  }
}
