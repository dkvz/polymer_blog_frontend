# Polymer Blog Frontend
This rough Polymer experiment is meant to work with one of my other projects as backend.

Features:
* Endless scrolling blog
* Post categories
* Comments
* Automatic table of content generation for articles
* Static pages

Check it out here: [http://dkvz.eu](https://dkvz.eu)

This was made with Polymer 1.0 but should probably work with 2.0 as well.

## Requirements
NodeJS with bower and gulp.

## Installing
Clone the repository.

Go to the root project directory and install the Node modules:
```
npm install
```

You can now install the bower dependencies:
```
bower install
```

## Running the site
For testing you can use:
```
gulp serve
```

To make the ready-to-deploy package you run:
```
gulp
```
This will remove then fill the 'dist' directory.

## Backend & Authoring
This frontend is set to use my personnal backend. Which is available here on Github: [dorade-blog-engine](https://github.com/dkvz/dorade-blog-engine)

**WARNING**: The database schema might not be up to date.

I'm also using a JavaFX tool to write my articles: [blog-authoring-tool](https://github.com/dkvz/blog-authoring-tool)

## Stuff you need to change
* You have to edit robots.txt and change the sitemap URL.
* In scripts/app.js you will have to change the base URL and the API URL.
* Everything in app-pages is static stuff from my website. So is part of the menu in index.html.

## TODO
There's a lot to do but one thing would be to migrate to Polymer 2.0 and how they now structure their starter kit (using an app-shell paradigm).
