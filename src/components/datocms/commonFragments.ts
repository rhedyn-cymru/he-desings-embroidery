import { graphql } from './graphql';

/*
 * This file lists a series of fragments not related to any specific Vue
 * component, but necessary in various parts of the code.
 */

export const TagFragment = graphql(/* GraphQL */`
  fragment TagFragment on Tag @_unmask {
    tag
    attributes
    content
  }
`);

export const ImageBlockFragment = graphql(/* GraphQL */`
  fragment ImageBlockFragment on ImageBlockRecord {
    asset {
      title
      responsiveImage(sizes: "(max-width: 700px) 100vw, 700px") {
        ...ResponsiveImageFragment
      }
    }
  }
`);

export const ImageGalleryBlockFragment = graphql(/* GraphQL */`
  fragment ImageGalleryBlockFragment on ImageGalleryBlockRecord {
    assets {
      id
      title
      responsiveImage(imgixParams: { w: 300 }, sizes: "300px") {
        ...ResponsiveImageFragment
      }
    }
  }
`);

export const VideoBlockFragment = graphql(/* GraphQL */`
  fragment VideoBlockFragment on VideoBlockRecord {
    asset {
      title
      video {
        muxPlaybackId
        title
        width
        height
        blurUpThumb
      }
    }
  }
`);

export const PageLinkFragment = graphql(/* GraphQL */`
  fragment PageLinkFragment on PageRecord {
    ... on RecordInterface {
      id
      __typename
    }
    ... on PageRecord {
      title
      slug
    }
  }
`);

export const PageInlineFragment = graphql(/* GraphQL */`
  fragment PageInlineFragment on PageRecord {
    ... on RecordInterface {
      id
      __typename
    }
    ... on PageRecord {
      title
      slug
    }
  }
`);
