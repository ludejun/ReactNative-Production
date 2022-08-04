class EventBus {
  events: { [key: string]: Array<Function> }

  constructor() {
    this.events = {}; // 存储自定义事件
  }

  // 发布事件
  on(event: string, fn: (any: unknown) => void) {
    this.events[event] ? this.events[event].push(fn) : (this.events[event] = [fn]);
  }

  // 订阅事件
  emit(event: string, ...rest: unknown[]) {
    if (!event) throw new Error('请传入事件名');
    // 获取订阅传参
    if (this.events[event])
      this.events[event].forEach((fn) => {
        try {
          fn(...rest);
        } catch (e) {
          console.error(`eventName:${event}回调执行报错：${e}`);
        }
      });
  }

  // 执行一次
  once(event: string, fn: (any: any) => void, ...rest: any) {
    const onceHandler = () => {
      fn(rest);
      this.off(event, onceHandler); // 执行成功后取消监听
    };
    this.on(event, onceHandler);
  }

  // 取消订阅
  off(event: string, fn: () => void) {
    // 不传入fn时取消事件名下的所有队列
    if (arguments.length === 1 || !fn) this.events[event] = [];

    // 取消事件名下的fn
    this.events[event] = this.events[event].filter((f) => f !== fn);
  }

  // 清空订阅
  clear() {
    this.events = {};
  }

  // 获取事件列表
  getAllEvents(event: string): Function[] {
    if (event) return this.events[event] || [];
    return [];
  }
}

export default new EventBus();
