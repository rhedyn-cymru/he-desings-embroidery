import { executeQuery } from "@datocms/cda-client";
import { graphql } from "./graphql";
import { ResponsiveImageFragment } from "./ResponsiveImage/fragments";

const queries = {
  fetchAllPages: graphql(/* GraphQL */ `
    {
      allPages {
        id
        title
        _status
        _firstPublishedAt
        slug
      }
      _allPagesMeta {
        count
      }
    }
  `),
  fetchAllProducts: graphql(/* GraphQL */ `
    {
      allProducts {
        id
        title
        slug
        price
        category {
          category
        }
        description
        images {
          url
        }
      }
    }
  `),
  fetchHomePage: graphql(/* GraphQL */ `
    {
      homepage {
        introTitle
        introFeaturedImage {
          url
          alt
        }
        introStructuredText {
          value
          links {
            slug
          }
        }
        aboutTitle
        aboutFeaturedImage {
          url
          alt
        }
        aboutStructuredText {
          value
          links {
            slug
          }
        }
      }
    }
  `),
  fetchPage: graphql(
    /* GraphQL */ `
      fragment ImageBlockFragment on ImageBlockRecord {
        asset {
          title
          responsiveImage(sizes: "(max-width: 700px) 100vw, 700px") {
            ...ResponsiveImageFragment
          }
        }
      }

      fragment ImageGalleryBlockFragment on ImageGalleryBlockRecord {
        assets {
          id
          title
          responsiveImage(imgixParams: { w: 300 }, sizes: "300px") {
            ...ResponsiveImageFragment
          }
        }
      }

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

      query MyQuery($slug: SlugFilter) {
        page(filter:{ slug: $slug }) {
          id
          title
          slug
          structuredText {
            value
            blocks {
              ... on RecordInterface {
                id
                __typename
              }
              ... on ImageBlockRecord {
                ...ImageBlockFragment
              }
              ... on ImageGalleryBlockRecord {
                ...ImageGalleryBlockFragment
              }
              ... on VideoBlockRecord {
                ...VideoBlockFragment
              }
            }
            links {
              ... on RecordInterface {
                id
                __typename
              }
              ...PageLinkFragment
              ...PageInlineFragment
            }
          }
        }
      }
    `,
    [ResponsiveImageFragment],
  ),

  fetchProduct: graphql(
    /* GraphQL */ `
      fragment ImageBlockFragment on ImageBlockRecord {
        asset {
          title
          responsiveImage(sizes: "(max-width: 700px) 100vw, 700px") {
            ...ResponsiveImageFragment
          }
        }
      }

      fragment ImageGalleryBlockFragment on ImageGalleryBlockRecord {
        assets {
          id
          title
          responsiveImage(imgixParams: { w: 300 }, sizes: "300px") {
            ...ResponsiveImageFragment
          }
        }
      }

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

      query MyQuery($slug: SlugFilter) {
        product(filter:{ slug: $slug }) {
          id
          title
          slug
          price
          category {
            category
          }
          description
          images {
            url
          }
          structuredText {
            value
            blocks {
              ... on RecordInterface {
                id
                __typename
              }
              ... on ImageBlockRecord {
                ...ImageBlockFragment
              }
              ... on ImageGalleryBlockRecord {
                ...ImageGalleryBlockFragment
              }
              ... on VideoBlockRecord {
                ...VideoBlockFragment
              }
            }
            links {
              ... on RecordInterface {
                id
                __typename
              }
              ...PageLinkFragment
              ...PageInlineFragment
            }
          }
        }
      }
    `,
    [ResponsiveImageFragment],
  ),
};

/**
 *
 * @param {string} queryType
 * @param {Object} variables - GraphQL query variables
 * @returns {Promise<string>}
 */
async function retrieveData(queryType, variables = {}) {

  const query = queries[queryType];

  if (!query) return;

  const result = await executeQuery(query, {
    token: import.meta.env.DATOCMS_CDA_TOKEN,
    variables,
  });

  return result;
}

export default retrieveData;
