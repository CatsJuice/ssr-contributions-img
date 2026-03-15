type CanvasContextStub = {
  font: string;
  measureText: (text?: string) => { width: number };
};

type ElementStub = {
  style: Record<string, unknown>;
  children: ElementStub[];
  appendChild: (child: ElementStub) => ElementStub;
  insertBefore: (child: ElementStub) => ElementStub;
  removeChild: (child: ElementStub) => ElementStub;
  setAttribute: () => void;
  getAttribute: () => null;
  getContext: () => CanvasContextStub;
  getBoundingClientRect: () => {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  addEventListener: () => void;
  removeEventListener: () => void;
};

function createCanvasContextStub(): CanvasContextStub {
  return {
    font: '',
    measureText(text = '') {
      return {
        width: `${text}`.length * 8,
      };
    },
  };
}

function createElementStub(): ElementStub {
  const children: ElementStub[] = [];

  return {
    style: {},
    children,
    appendChild(child) {
      children.push(child);
      return child;
    },
    insertBefore(child) {
      children.push(child);
      return child;
    },
    removeChild(child) {
      const index = children.indexOf(child);
      if (index >= 0) children.splice(index, 1);
      return child;
    },
    setAttribute() {},
    getAttribute() {
      return null;
    },
    getContext() {
      return createCanvasContextStub();
    },
    getBoundingClientRect() {
      return {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };
    },
    addEventListener() {},
    removeEventListener() {},
  };
}

const globalScope = globalThis as any;

if (!globalScope.window) {
  globalScope.window = {};
}

if (!globalScope.navigator) {
  globalScope.navigator = { userAgent: 'node' };
}

if (!globalScope.document) {
  globalScope.document = {
    body: createElementStub(),
    documentElement: {
      style: {},
    },
    createElement() {
      return createElementStub();
    },
  };
}

globalScope.window.navigator = globalScope.navigator;

export {};
