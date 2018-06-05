interface props {
  children?: element[];
  [key: string]: any;
}

interface element {
  type: string;
  props: props;
  nodeValue?: string;
  [event: string]: any;
}

interface instance {
  dom: HTMLElement | Text;
  element: element;
  childInstances?: instance[];
}

const TEXTELEMENT = 'TEXT ELEMENT';
type TEXTELEMENT = typeof TEXTELEMENT;
// start
let rootInstance: instance | null = null;

function render(element: element, container: HTMLElement) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}

function reconcile(parentDom: HTMLElement, instance: instance | null, element: element): instance {
  const newInstance = instantiate(element); // element -> instance
  // 初始化时虚拟主干dom为null
  if (instance === null) {
    parentDom.appendChild(newInstance.dom);
  } else {
    parentDom.replaceChild(newInstance.dom, instance.dom);
  }

  return newInstance;
}
// end

// 递归instantiate
function instantiate(element:element): instance {
  const { type, props } = element;

  // create DOM element
  const isTextElement = type === TEXTELEMENT;
  const dom = isTextElement ? document.createTextNode('') : document.createElement(type);

  // Add event listeners
  const isListener = (name: string) => name.startsWith('on');
  Object.keys(props).filter(isListener).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    // Type Guards
    if (dom instanceof HTMLElement) {
      dom.addEventListener(eventType, props[name]);
    }
  });

  // Set properties
  const isAttribute = (name: string) => !isListener && name !== 'children';
  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  });
  // dom 构造完成

  // Render children
  const childElements = props.children;
  let instance: instance = { dom, element };

  if (typeof childElements !== 'undefined') {
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);

    childDoms.forEach(childDom => dom.appendChild(childDom));
    instance.childInstances = childInstances;
  }

  return instance;
}

function createTextElement(value:string):element {
  return createElement(TEXTELEMENT, { nodeValue: value });
}

function createElement(type: string, config: props, ...args: Array<element | string>): element {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [...args] : [];
  props.children = rawChildren.map(c => typeof c === 'string' ? createTextElement(c) : c);

  return {
    type,
    props
  };
}
