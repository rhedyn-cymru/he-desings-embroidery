import { executeQuery } from "@datocms/cda-client";

const queries = {
  fetchAllPages: `
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
`,
  fetchHomePage: `
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
`,
  fetchPage: `  
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
