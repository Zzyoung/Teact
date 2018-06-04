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

const TEXTELEMENT = 'TEXT ELEMENT';
type TEXTELEMENT = typeof TEXTELEMENT;

function render(element:element, parentDom: HTMLElement | Text) {
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

  // Render children
  const childElements = props.children;
  if (typeof childElements !== 'undefined') {
    childElements.forEach(childElement => render(childElement, dom));
  }

  // append to parent
  parentDom.appendChild(dom);
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
