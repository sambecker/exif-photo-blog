'use client';

import {
  ClipboardEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useFormStatus } from 'react-dom';
import { clsx } from 'clsx/lite';
import MentionMenu from '@/mention/MentionMenu';
import { Mention } from '@/mention';
import { Albums } from '@/album';
import { Tags } from '@/tag';
import {
  createMentionElement,
  populateElementWithMarkup,
  serializeElementToMarkup,
} from './markup';

// Text between an "@" (at a word boundary) and the caret
const MENTION_QUERY_REGEX = /(?:^|\s)@([^@\s][^@\n]{0,39}|)$/;

const MENU_WIDTH = 320;

const MENU_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', 'Tab'];

interface MentionQuery {
  node: Text
  start: number
  end: number
  query: string
  top: number
  left: number
}

export default function RichTextEditor({
  id,
  label,
  value: initialValue,
  placeholder,
  onChange,
  mentionAlbums,
  mentionTags,
  className,
}: {
  id: string
  label: string
  value: string
  placeholder?: string
  onChange?: (value: string) => void
  mentionAlbums: Albums
  mentionTags: Tags
  className?: string
}) {
  const refContainer = useRef<HTMLDivElement>(null);
  const refEditor = useRef<HTMLDivElement>(null);
  const refMenu = useRef<HTMLDivElement>(null);
  const refInitialValue = useRef(initialValue);
  // Escaped "@" positions shouldn't reopen until a new "@" is typed
  const refDismissed = useRef<Pick<MentionQuery, 'node' | 'start'>>(undefined);

  const [markup, setMarkup] = useState(initialValue);
  const [mentionQuery, setMentionQuery] = useState<MentionQuery>();

  const { pending } = useFormStatus();

  useLayoutEffect(() => {
    if (refEditor.current) {
      populateElementWithMarkup(refEditor.current, refInitialValue.current);
    }
  }, []);

  const emitChange = useCallback(() => {
    if (refEditor.current) {
      const markup = serializeElementToMarkup(refEditor.current);
      setMarkup(markup);
      onChange?.(markup);
    }
  }, [onChange]);

  const updateMentionQuery = useCallback(() => {
    const editor = refEditor.current;
    const container = refContainer.current;
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : undefined;
    const node = range?.startContainer;

    if (
      !editor ||
      !container ||
      !range?.collapsed ||
      !(node instanceof Text) ||
      !editor.contains(node)
    ) {
      setMentionQuery(undefined);
      return;
    }

    const end = range.startOffset;
    const match = node.data.slice(0, end).match(MENTION_QUERY_REGEX);
    const start = match ? end - match[1].length - 1 : -1;

    if (
      !match || (
        refDismissed.current?.node === node &&
        refDismissed.current.start === start
      )
    ) {
      setMentionQuery(undefined);
      return;
    }

    const rangeAt = document.createRange();
    rangeAt.setStart(node, start);
    rangeAt.setEnd(node, start + 1);
    const rectAt = rangeAt.getBoundingClientRect();
    const rectContainer = container.getBoundingClientRect();

    setMentionQuery({
      node,
      start,
      end,
      query: match[1],
      top: rectAt.bottom - rectContainer.top + 6,
      left: Math.max(0, Math.min(
        rectAt.left - rectContainer.left,
        rectContainer.width - MENU_WIDTH,
      )),
    });
  }, []);

  useEffect(() => {
    const onSelectionChange = () => {
      if (document.activeElement === refEditor.current) {
        updateMentionQuery();
      }
    };
    document.addEventListener('selectionchange', onSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', onSelectionChange);
  }, [updateMentionQuery]);

  const insertMention = useCallback((mention: Mention) => {
    if (!mentionQuery) { return; }
    const { node, start, end } = mentionQuery;

    const range = document.createRange();
    range.setStart(node, start);
    range.setEnd(node, Math.min(end, node.length));
    range.deleteContents();

    // Trailing space gives the caret somewhere to land after the mention
    const space = document.createTextNode('\u00a0');
    range.insertNode(space);
    range.insertNode(createMentionElement(document, mention));

    const selection = window.getSelection();
    selection?.removeAllRanges();
    const rangeCaret = document.createRange();
    rangeCaret.setStart(space, 1);
    rangeCaret.collapse(true);
    selection?.addRange(rangeCaret);

    setMentionQuery(undefined);
    emitChange();
  }, [mentionQuery, emitChange]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.nativeEvent.isComposing) { return; }

    if (mentionQuery) {
      if (e.key === 'Escape') {
        e.preventDefault();
        refDismissed.current = mentionQuery;
        setMentionQuery(undefined);
        return;
      }
      const hasResults = Boolean(refMenu.current?.querySelector('[cmdk-item]'));
      if (MENU_KEYS.includes(e.key) && hasResults && !e.shiftKey) {
        e.preventDefault();
        refMenu.current?.dispatchEvent(new window.KeyboardEvent('keydown', {
          key: e.key === 'Tab' ? 'Enter' : e.key,
          bubbles: true,
          cancelable: true,
        }));
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const lines = e.clipboardData.getData('text/plain').split(/\r\n|\n|\r/);
    lines.forEach((line, index) => {
      if (index > 0) { document.execCommand('insertLineBreak'); }
      if (line) { document.execCommand('insertText', false, line); }
    });
  };

  return (
    <div className={clsx('space-y-1', className)}>
      <label id={`${id}-label`}>
        {label}
      </label>
      <div ref={refContainer} className="relative">
        <div
          ref={refEditor}
          id={id}
          role="textbox"
          aria-multiline
          aria-labelledby={`${id}-label`}
          aria-readonly={pending}
          contentEditable={!pending}
          tabIndex={0}
          spellCheck
          onInput={emitChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => setMentionQuery(undefined)}
          className={clsx(
            'control w-full min-h-36 cursor-text',
            'text-[1rem] whitespace-pre-wrap wrap-break-word',
            'outline-blue-600 focus:outline-2 -outline-offset-2',
            '[&_a]:underline',
            pending && 'bg-gray-100 dark:bg-gray-900 dark:text-gray-400',
          )}
        />
        {!markup && placeholder &&
          <div
            aria-hidden
            className={clsx(
              'absolute inset-0 px-2.5 py-2 border border-transparent',
              'font-mono text-[1rem] leading-tight text-extra-dim',
              'pointer-events-none truncate',
            )}
          >
            {placeholder}
          </div>}
        {mentionQuery &&
          <MentionMenu
            ref={refMenu}
            query={mentionQuery.query}
            albums={mentionAlbums}
            tags={mentionTags}
            onSelect={insertMention}
            className="absolute z-10"
            style={{ top: mentionQuery.top, left: mentionQuery.left }}
          />}
      </div>
      <input type="hidden" name={id} value={markup} />
    </div>
  );
}
