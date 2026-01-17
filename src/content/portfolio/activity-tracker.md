---
title: "Activity tracker"
client: "undisclosed"
image: "/content/portfolio/website-template-code.png"
description: "Track when users are watching a video and pass that data to a function that can aggregate and store the data in a structure that can be used later."
featured: false
locale: en
tags: 
  - javascript
---
## The Challenge

Tracking users on a video streaming platform that provided users with analytics data and qualifications that linked to the videos they had watched.

It was challenging because the videos could come from different providers, for example a YouTube embed, Vimeo, JWPlayer or an in-house custom Web Component.

If none of these were detected yet conditions indicated there _was_ a video playing (eg from the URL), we would provide a fallback tracker where the users' time on the page was an indicator of watch duration.

## The Approach

A script would run when the page initialised. It listened for events from any of the players mentioned above. This involved researching to find out what events each player sent and when.

Once a play event was detected, a Web Worker was created for that particular video watch instance.

The Web Worker allowed us to aggregate watch duration (how long a person had been watching a video) and other metrics on the client, and would continue to be called until a person reached the end of the video, or until they navigated away.

Data could then be sent using a POST request to a Serverless Lambda function.

This function would transform the data it received, adding further metadata that would be used to add details relevant to their learning session and store it in a document store (MongoDB).

We could then render that data in the users' dashboard and issue qualification certificates for their learning.