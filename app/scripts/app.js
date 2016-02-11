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

  // Sets app default base URL
  app.baseUrl = '/';
  // Set API URL:
  app.apiBaseUrl = 'http://localhost:9000/';
  // The array holding all the articles:
  app.articles = [];
  // Boolean that tells if articles are currently loading:
  app.syncing = false;
  
  if (window.location.port === '') {  // if production
    // Uncomment app.baseURL below and
    // set app.baseURL to '/your-pathname/' if running from folder in production
    // app.baseUrl = '/polymer-starter-kit/';
  }
  
  function handleArticleResponseReplace(e) {
    app.articles = e.detail.response;
    app.syncing = false;
  }
  
  function handleArticleResponseAdd(e) {
    for (var i = 0; i < e.detail.response.length; i++) {
      app.articles.push(e.detail.response[i]);
    }
    app.syncing = false;
  }
  
  function loadArticles(start, replace) {
    if (app.syncing) {
      // Still syncinc, not doing shit.
      return;
    }
    console.log('Loading articles starting from ' + start + '...');
    //var ajax = document.querySelector('#articleSelector');
    var ajax = app.$.articleSelector;
    ajax.url = app.apiBaseUrl + 'articles-starting-from/' + start;
    app.syncing = true;
    if (replace) {
      ajax.addEventListener('response', handleArticleResponseReplace);
    } else {
      ajax.addEventListener('response', handleArticleResponseAdd);
    }
  }

  app.displayInstalledToast = function() {
    // Check to make sure caching is actually enabled?it won't be in the dev environment.
    if (!Polymer.dom(document).querySelector('platinum-sw-cache').disabled) {
      Polymer.dom(document).querySelector('#caching-complete').show();
    }
  };

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    //console.log('Our app is ready to rock!');
    // Load articles starting from the first one.
    console.log('Loading articles...');
    loadArticles(0, true);
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    app.$.headerPanelMain.scrollToTop(true);
  };

  app.closeDrawer = function() {
    app.$.paperDrawerPanel.closeDrawer();
  };

})(document);
