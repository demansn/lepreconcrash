
class ApiAction {
  constructor(container, { method, args = [], resultKey }) {
    this.apiService = container.resolve('apiService');
    this.method = method;
    this.args = args;
    this.resultKey = resultKey;
  }

  async execute(result) {
    const apiResult = await this.apiService.request(this.method, ...this.args);
    if (this.resultKey) {
      result[this.resultKey] = apiResult;
    }
  }
}

export default ApiAction;
        