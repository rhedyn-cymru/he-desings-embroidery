---
title: "Media player"
client: "undisclosed"
image: "/content/portfolio/website-template-code.png"
description: "Render video or audio content from a stream, either live data or prerecorded."
featured: false
locale: en
tags: 
  - javascript
---
## The Challenge

Build a media player that could be easily embedded on a site with 2-3 lines of code. The player would use a token to call an API which then returned the stream in m3u8 data format along with thumbnails, chapters data, and other information.

In order to integrate with the rest of the learning platform, we facilitate a lot of customisation, from adding buttons to special properties for analytics data and even being able to alter the look and feel of the player to a certain extent.

## The Approach

We created a Custom HTML Element for the easiest possible way to integrate the player so that people who were not technically minded could use it.

The player provided all of the UI elements such as play / pause buttons, the timeline, chapter switcher, and casting to Chrome or Amazon device. It also rendered a pop-out player that would float inside the browser window as the user scrolled down the page.

It also emitted a wide range of events so that we could integrate it with activity trackers, countdown timers (for shows that would start at a specific times) and a login form which blocked the content until a user was logged in to the platform.

The player could recieve events too so that it could be paused or played from external code, and we also allowed users to access the chapters data via a Custom Event.

The player is used today across the world and renders thousands of streams a day, both pre-recorded video content and livestreams. It also supports audio content which can be used for podcasts etc.