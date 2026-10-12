import { Fragment, ReactNode, createElement } from 'react';
import PhotoLink from '@/photo/PhotoLink';
import PhotoAlbum from '@/album/PhotoAlbum';
import PhotoTag from '@/tag/PhotoTag';
import { FormattedHtmlNode } from '@/utility/html';
import { MentionContent } from '.';

const FORMATTING_TAGS = ['b', 'strong', 'i', 'em', 'u'];

export default function MentionHtml({
  content: { nodes, photos, albums },
}: {
  content: MentionContent
}) {
  const renderNodes = (nodes: FormattedHtmlNode[], keyPrefix = ''): ReactNode =>
    nodes.map((node, index) => renderNode(node, `${keyPrefix}${index}`));

  const renderNode = (node: FormattedHtmlNode, key: string): ReactNode => {
    if (typeof node === 'string') {
      return <Fragment key={key}>{node}</Fragment>;
    }

    const { tag, attributes: { id = '', href, target } } = node;
    const children = renderNodes(node.children, `${key}-`);

    switch (tag) {
      case 'br':
        return <br key={key} />;
      case 'a':
        return <a
          key={key}
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>;
      case 'photo': {
        const photo = photos[id];
        return photo
          ? <PhotoLink
            key={key}
            photo={photo}
            classNameHover="inline"
            prefetch={false}
            showHover
          >
            {children}
          </PhotoLink>
          : <Fragment key={key}>{children}</Fragment>;
      }
      case 'album': {
        const album = albums[id];
        return album
          ? <PhotoAlbum key={key} album={album} label={children} type="naked" />
          : <Fragment key={key}>{children}</Fragment>;
      }
      case 'tag':
        return id
          ? <PhotoTag key={key} tag={id} label={children} type="naked" />
          : <Fragment key={key}>{children}</Fragment>;
      default:
        return FORMATTING_TAGS.includes(tag)
          ? createElement(tag, { key }, children)
          : <Fragment key={key}>{children}</Fragment>;
    }
  };

  return renderNodes(nodes);
}
