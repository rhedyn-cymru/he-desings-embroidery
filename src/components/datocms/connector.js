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
};

/**
 *
 * @param {string} queryType
 * @returns {Promise<string>}
 */
async function retrieveData(queryType) {
  console.log({ queryType });

  const query = queries[queryType];

  if (!query) return;

  const result = await executeQuery(query, {
    token: import.meta.env.DATOCMS_CDA_TOKEN,
  });

  console.log({ result });

  return result;
}

export default retrieveData;
