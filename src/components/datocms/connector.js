import { executeQuery } from "@datocms/cda-client";

const query = `
  query {
    allArticles {
      id
      title
    }
  }
`;

const result = await executeQuery(query, {
  token: import.meta.env.DATOCMS_CDA_TOKEN,
  options: {
    fetchFn: globalThis.fetch
  }
});

console.log(result);