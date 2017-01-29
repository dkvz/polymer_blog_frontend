/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');
  
  // Max number of articles to load:
  app.maxArticles = '6';
  // The max to use while scrolling for more articles:
  app.maxArticlesScroll = '2';
  // Sets app default base URL
  app.baseUrl = '/';
  // Set API URL:
  app.apiBaseUrl = 'http://dorade-api.servebeer.com/';
  //app.apiBaseUrl = 'http://localhost:9000/';
  app.articleApiUrl = app.apiBaseUrl + 'article';
  // The array holding all the articles:
  app.articles = [];
  // The array holding all the tags:
  app.tags = [];
  // Array holding current tags being used as filters:
  app.currentTags = [];
  // Boolean that tells if articles are currently loading:
  app.syncing = false;
  // Text notification to show on top of the index page. Leave blank
  // for no notification (may be modified in a method later):
  app.notification = '';
  // Title base of the app:
  app.titleBase = 'Blog des gens compliqués';
  // Boolean deciding if we have to immediately scroll to the bottom
  // of an article:
  app.scrollToBottom = false;
  
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }
  
  function loadArticles(start) {
    if (app.syncing) {
      // Still syncinc, not doing shit.
      console.log('Still syncing...');
      return;
    }
    console.log('Loading articles starting from ' + start + '...');
    var ajax = app.$.articleSelector;
    app.syncing = true;
    var maxArt = app.maxArticles;
    if (start > 0) {
      maxArt = app.maxArticlesScroll;
    }
    var ajUrl = app.apiBaseUrl + 'articles-starting-from/' + start + '?max=' + maxArt;
    if (app.currentTags.length > 0) {
      // URL encode the tags and add them to the URL using comma as separator.
      ajUrl = ajUrl.concat('&tags=');
      for (var i = 0; i < app.currentTags.length; i++) {
        if (i > 0) {
          ajUrl = ajUrl.concat(',');
        }
        ajUrl = ajUrl.concat(encodeURIComponent(app.currentTags[i]));
      }
    }
    ajax.url = ajUrl;
    ajax.generateRequest();
  }
  
  app.handleResponse = function(e) {
    console.log('Adding more elements:' + e.detail.response.length);
    for (var i = 0; i < e.detail.response.length; i++) {
      app.$.articleList.push('items', e.detail.response[i]);
    }
    //app.$.articleList.fire('iron-resize');
    app.$.scrollThres.clearTriggers();
    app.syncing = false;
  };
  
  app.scrollToItem = function(itm) {
    console.log('Scrolling to item ' + itm + '...');
    var scrollTo = document.querySelector('#' + itm);
    if (scrollTo) {
      scrollTo.scrollIntoView();
    }
  };
  
  app.handleError = function() {
    console.log('No more articles to load.');
    app.syncing = false;
  };
  
  app.handleTagsError = function() {
    console.log('Could not load tags for some reason.');
  };
  
  app.handleTagsResponse = function(e) {
    if (e.detail.response) {
      for (var i = 0; i < e.detail.response.length; i++) {
        this.push('tags', e.detail.response[i]);
      }
    }
  };

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled?it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };
  
  app.changeTag = function(e) {
    console.log('Changing tag to ' + e.srcElement.innerText);
    if (e.srcElement.innerText !== '') {
      // Currently we reset all tags.
      app.currentTags = [];
      this.push('currentTags', e.srcElement.innerText);
      // Fire article loading, we need to load from 0 here.
      // We also need to reset a whole bunch of arrays.
      app.refreshArticles();
    }
  };
  
  app.refreshArticles = function() {
    app.$.articleList.splice('items', 0, app.$.articleList.items.length);
    // This array is actually not used but whatevs
    app.articles = [];
    app.syncing = false;
    loadArticles(0);
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    //console.log('Our app is ready to rock!');
    //app.$.articleList.scrollTarget = app.$.headerPanelMain.scroller;
    
    app.scrollTarget = app.$.headerPanelMain.scroller;
    app.$.scrollThres.clearTriggers();
    // Load articles starting from the first one.
    //console.log('Loading articles...');
    //var ajax = app.$.articleSelector;
    //ajax.addEventListener('response', handleResponse);
    //loadArticles(0);
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });
  
  app.loadMoreData = function() {
    // We can start selecting depending on how many items are in the list:
    // The event seems to shoot on page load?
    // Correction: after an iron-threshold update it no longer shoots at load...
    // This demands a pretty big revision.
    console.log('Firing loadMoreData...');
    if (app.route === 'home') {
      var startFrom = app.$.articleList.items.length;
      console.log('Loading more data starting from ' + startFrom + '...');
      loadArticles(startFrom, false);
    } else if (app.route === 'articles') {
      app.$.commentSection.loadMoreComments();
      app.$.scrollThres.clearTriggers();
    } else {
      // We still need to clearTriggers...
      app.$.scrollThres.clearTriggers();
    }
  };
  
  app.pageChanged = function() {
    if (app.route === 'pages-content') {
      console.log('Opening a custom page');
    }
  };

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

})(document);
