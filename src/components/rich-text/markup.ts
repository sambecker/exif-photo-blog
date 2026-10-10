import {
  Mention,
  escapeHtmlAttribute,
  escapeHtmlText,
  isMentionType,
  markupForMention,
  parseMentionId,
} from '@/mention';

const FORMATTING_TAGS = ['b', 'strong', 'i', 'em', 'u'];
const BLOCK_TAGS = ['div', 'p'];
const DISCARDED_TAGS = ['script', 'style', 'template'];

const ATTRIBUTE_MENTION_TYPE = 'data-mention-type';
const ATTRIBUTE_MENTION_ID = 'data-mention-id';
const ATTRIBUTE_MENTION_TOKEN = 'data-mention-token';

const CLASS_MENTION = 'text-main';

const CLASS_MENTION_TOKEN = 'text-dim';

const createMentionTokenElement = (doc: Document, text: string) => {
  const element = doc.createElement('span');
  element.setAttribute('contenteditable', 'false');
  element.setAttribute(ATTRIBUTE_MENTION_TOKEN, '');
  element.className = CLASS_MENTION_TOKEN;
  element.textContent = text;
  return element;
};

const isMentionToken = (node: Node) =>
  node.nodeType === Node.ELEMENT_NODE &&
  (node as Element).hasAttribute(ATTRIBUTE_MENTION_TOKEN);

// Opening/closing tags are locked to preserve links while titles stay editable
export const createMentionElement = (
  doc: Document,
  { type, id, title }: Mention,
) => {
  const element = doc.createElement('span');
  element.setAttribute(ATTRIBUTE_MENTION_TYPE, type);
  element.setAttribute(ATTRIBUTE_MENTION_ID, id);
  element.className = CLASS_MENTION;
  element.append(
    createMentionTokenElement(doc, `<${type} id={${id}}>`),
    doc.createTextNode(title),
    createMentionTokenElement(doc, `</${type}>`),
  );
  return element;
};

export const isNodeInsideMention = (node: Node) =>
  Boolean(node.parentElement?.closest(`[${ATTRIBUTE_MENTION_TYPE}]`));

const getMentionTitle = (element: Element) =>
  Array.from(element.childNodes)
    .filter(node => !isMentionToken(node))
    .map(node => node.textContent ?? '')
    .join('')
    .replaceAll('\u00a0', ' ')
    .replace(/\s*[\r\n]+\s*/g, ' ');

// Deleting either tag token unlinks the mention, leaving its title as text
const getMentionFromElement = (element: Element): Mention | undefined => {
  const type = element.getAttribute(ATTRIBUTE_MENTION_TYPE);
  const id = element.getAttribute(ATTRIBUTE_MENTION_ID);
  const hasTokens =
    element.firstChild !== null &&
    element.lastChild !== element.firstChild &&
    isMentionToken(element.firstChild) &&
    isMentionToken(element.lastChild!);
  return isMentionType(type) && id && hasTokens
    ? { type, id, title: getMentionTitle(element) }
    : undefined;
};

// Rebuilds parsed nodes from an allowlist rather than trusting markup
const convertMarkupNode = (node: Node, doc: Document): Node[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent ?? '')];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) { return []; }

  const element = node as Element;
  const tag = element.localName;
  const convertChildren = () => Array.from(element.childNodes)
    .flatMap(child => convertMarkupNode(child, doc));

  if (DISCARDED_TAGS.includes(tag)) {
    return [];
  } else if (tag === 'br') {
    return [doc.createElement('br')];
  } else if (isMentionType(tag)) {
    const id = parseMentionId(element.getAttribute('id'));
    const title = element.textContent ?? '';
    return id
      ? [createMentionElement(doc, { type: tag, id, title })]
      : [doc.createTextNode(title)];
  } else if (FORMATTING_TAGS.includes(tag)) {
    const formatted = doc.createElement(tag);
    formatted.append(...convertChildren());
    return [formatted];
  } else if (tag === 'a') {
    const href = element.getAttribute('href');
    if (href) {
      const anchor = doc.createElement('a');
      anchor.setAttribute('href', href);
      anchor.append(...convertChildren());
      return [anchor];
    }
  }

  return convertChildren();
};

export const populateElementWithMarkup = (
  root: HTMLElement,
  markup: string,
) => {
  const doc = root.ownerDocument;
  const parsed = new DOMParser().parseFromString(
    markup.replace(/\r\n|\n|\r/g, '<br>'),
    'text/html',
  );
  root.replaceChildren(...Array.from(parsed.body.childNodes)
    .flatMap(node => convertMarkupNode(node, doc)));
};

const serializeNodes = (nodes: NodeListOf<ChildNode>): string =>
  Array.from(nodes)
    .map((node, index) => serializeNode(node, index > 0))
    .join('');

const serializeNode = (node: Node, hasPreviousSibling: boolean): string => {
  if (node.nodeType === Node.TEXT_NODE) {
    return escapeHtmlText((node.textContent ?? '').replaceAll('\u00a0', ' '));
  }

  if (node.nodeType !== Node.ELEMENT_NODE) { return ''; }

  const element = node as Element;
  const tag = element.localName;

  if (isMentionToken(element)) { return ''; }

  const mention = getMentionFromElement(element);
  if (mention) { return markupForMention(mention); }

  const children = serializeNodes(element.childNodes);

  if (tag === 'br') {
    return '\n';
  } else if (FORMATTING_TAGS.includes(tag)) {
    return children ? `<${tag}>${children}</${tag}>` : '';
  } else if (tag === 'a') {
    const href = element.getAttribute('href');
    return href
      ? `<a href="${escapeHtmlAttribute(href)}">${children}</a>`
      : children;
  } else if (BLOCK_TAGS.includes(tag)) {
    // Browsers represent empty lines as <div><br></div>
    const isEmptyLine =
      element.childNodes.length === 1 &&
      element.firstChild?.nodeName === 'BR';
    return `${hasPreviousSibling ? '\n' : ''}${isEmptyLine ? '' : children}`;
  }

  return children;
};

export const serializeElementToMarkup = (root: HTMLElement) =>
  serializeNodes(root.childNodes).trimEnd();
