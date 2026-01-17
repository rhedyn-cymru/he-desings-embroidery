---
title: "Chat app"
client: "undisclosed"
image: "/content/portfolio/website-template-code.png"
description: "Build a chat application to facilitate communication between buyers, sellers and intermediaries."
featured: false
locale: en
tags: 
  - javascript
---
## The Challenge

On a platform that brought buyers and sellers from a specific industry together, frequent communication needed to be integrated to the platform to facilitate better monitoring of buyer and seller activities. It would also facilitate better monitoring and regulation of intermediaries.

This was a challenging project because the backend was a brand new GraphQL API built for the project. The API didn't have subscriptions yet. So we had to find a way of making sure data fetching was timely and done in a responsible way without overloading the server.

## The Approach

This project was part of a suite of 12+ applications built with Next.js, a React framework. It was tightly coupled with UI and other primitives in a monorepo managed by Nx.

Although this layer made delivery more complex, it ultimately made sure the UI was kept in line with brand guidelines, and also made the GraphQL API available for other applications that would follow.

The other complexity involved dates and times. We needed to provide a uniform way of referring to events that had passed in a user-friendly way. So we wouldn't use time stamps (eg "15.12"), we would format the time relevant to the user (eg. "5 minutes ago"), which would be kept up to date minute by minute.

Also when a user scrolled to older content, we needed to retrieve older data and display that. But we still needed to poll the server in a responsible way so that any new messages could be received, and the user could be notified of them.

The completed chat interface could be hosted as a static application, meaning it was cost effective for the company.