import { executeQuery } from "@datocms/cda-client";
import { graphql } from "./graphql";
import { ResponsiveImageFragment } from "./ResponsiveImage/fragments";
import {
  ImageBlockFragment,
  ImageGalleryBlockFragment,
  VideoBlockFragment,
  PageLinkFragment,
  PageInlineFragment,
} from "./commonFragments";

const queries = {
  fetchGlobalSeo: graphql(/* GraphQL */`
    {
      _site {
        globalSeo {
          titleSuffix
          fallbackSeo {
            description
            title
            image { url }
          }
        }
      }
    }
  `),
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
    [
      ResponsiveImageFragment,
      ImageBlockFragment,
      ImageGalleryBlockFragment,
      VideoBlockFragment,
      PageLinkFragment,
      PageInlineFragment,
    ],
  ),

  fetchProduct: graphql(
    /* GraphQL */ `
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
    [
      ResponsiveImageFragment,
      ImageBlockFragment,
      ImageGalleryBlockFragment,
      VideoBlockFragment,
      PageLinkFragment,
      PageInlineFragment,
    ],
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
