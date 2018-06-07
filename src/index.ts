interface props {
  children?: TeactElement[];
  [key: string]: any;
}

interface TeactElement {
  type: string;
  props: props;
  nodeValue?: string;
  [event: string]: any;
}

interface instance {
  dom: HTMLElement | Text;
  element: TeactElement;
  publicInstance?: Component;
  childInstances?: instance[];
  childInstance?: any;
}

const TEXTELEMENT = 'TEXT ELEMENT';
type TEXTELEMENT = typeof TEXTELEMENT;
// start
let rootInstance: instance | null = null;

function render(element: TeactElement, container: HTMLElement) {
  const prevInstance = rootInstance;
  const nextInstance = reconcile(container, prevInstance, element);
  rootInstance = nextInstance;
}

function reconcile(parentDom: HTMLElement, prevInstance: instance | null, element: TeactElement): instance|null {
  const newInstance = instantiate(element); // element -> instance
  // 初始化时虚拟主干dom为null
  if (prevInstance === null) {
    parentDom.appendChild(newInstance.dom);
  } else if (element === null) {
    parentDom.removeChild(prevInstance.dom);
    return null;
  } else if(prevInstance.element.type !== element.type){
    // replace instance
    parentDom.replaceChild(newInstance.dom, prevInstance.dom);

    return prevInstance;
  } else if(typeof element.type === 'string') {
    // update dom instance
    updateDomProperties(prevInstance.dom, prevInstance.element.props, element.props);
    prevInstance.childInstances = reconcileChildren(prevInstance, element);
    prevInstance.element = element;

    return prevInstance;
  } else {
    // 更新组件
    prevInstance.publicInstance.props = element.props;
    const childElement = prevInstance.publicInstance.render(); // 组件的render函数
    const oldChildInstance = prevInstance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement)!; // 对比剩下的孩子

    prevInstance.dom = childInstance.dom;
    prevInstance.childInstance = childInstance;
    prevInstance.element = element;
    prevInstance.element = element;

    return prevInstance;
  }

  return newInstance;
}
// end

function reconcileChildren(prevInstance:instance, element: TeactElement) {
  const prevChildInstances = prevInstance.childInstances || [];
  const nextChildElements = element.props.children || [];
  const newChildInstances:instance[] = [];
  const count = Math.max(prevChildInstances.length, nextChildElements.length);

  for(let i = 0; i < count; i++) {
    const prevChildInstance = prevChildInstances[i];
    const childElement = nextChildElements[i];

    const newChildInstance = reconcile(prevInstance.dom as HTMLElement, prevChildInstance, childElement)!;
    newChildInstances.push(newChildInstance);
  }
  return newChildInstances.filter(instance => instance != null);
}

// 递归instantiate
function instantiate(element:TeactElement): instance {
  const { type, props } = element;
  const isDomElement  = typeof type === 'string';
  if (isDomElement) {
    // create DOM element
    const isTextElement = type === TEXTELEMENT;
    const dom = isTextElement ? document.createTextNode('') : document.createElement(type);
    let instance: instance = { dom, element };

    // 更新dom属性，避免创建新dom
    updateDomProperties(dom, {}, props);

    // Render children
    const childElements = props.children;

    if (typeof childElements !== 'undefined') {
      const childInstances = childElements.map(instantiate);
      const childDoms = childInstances.map(childInstance => childInstance.dom);

      childDoms.forEach(childDom => dom.appendChild(childDom));
      instance.childInstances = childInstances;
    }

    return instance;
  }
  
  const instance:any = {};
  const publicInstance = createPublicInstance(element, instance);
  const childElement = publicInstance.render();
  const childInstance = instantiate(childElement);
  const dom = childInstance.dom;
  
  Object.assign(instance, {dom, element, childInstance, publicInstance});
  return instance;
}

function updateDomProperties(dom:HTMLElement|Text, prevProps: props, nextProps: props) {
  const isEvent = (name: string) => name.startsWith('on');
  const isAttribute = (name: string) => !isEvent(name) && name !== 'children';

  
  if (dom instanceof HTMLElement) {
    Object.keys(prevProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    })

    Object.keys(nextProps).filter(isEvent).forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
  }
  
  // remove previous props
  Object.keys(prevProps).filter(isAttribute).forEach(name => {
    dom[name] = null;
  });

  // add next props
  Object.keys(nextProps).filter(isAttribute).forEach(name => {
    dom[name] = nextProps[name];
  });
}

function createTextElement(value:string|number):TeactElement {
  return createElement(TEXTELEMENT, { nodeValue: value });
}

function isTeactElement(c: TeactElement | string| number): c is TeactElement {
  return typeof c !== 'string' && typeof c !== 'number';
}

function createElement(type: string, config: props, ...args: Array<TeactElement | string | number>): TeactElement {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const defaultArray: Array<TeactElement|string|number> = [];
  const rawChildren = hasChildren ? defaultArray.concat(...args) : defaultArray;
  props.children = rawChildren.map(c => isTeactElement(c) ? c : createTextElement(c));

  return {
    type,
    props
  };
}


// Component
class Component {
  __internalInstance: any;
  render:any;
  constructor(public props: props, public state: Object = {}) {

  }
  setState(partialState: Object) {
    this.state = Object.assign({}, this.state, partialState);
    updateInstance(this.__internalInstance); // 更新虚拟-dom树和更新html
  }
}

function createPublicInstance(element: TeactElement, internalInstance: any) {
  // 当元素进来这里，说明type是一个函数
  const { type, props } = element;
  const publicInstance = new type(props);

  publicInstance.__internalInstance = internalInstance; // 内部实例的引用
  return publicInstance;
}

function updateInstance(internalInstance:instance) {
  const parentDom = internalInstance.dom.parentElement;
  const element = internalInstance.element;

  if (parentDom !== null) {
    reconcile(parentDom, internalInstance, element);
  }
}

window.Teact = {
  render,
  createElement,
  Component
}

// export default {
//   render,
//   createElement
// }