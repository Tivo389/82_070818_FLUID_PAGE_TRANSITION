/* global document */
/* global window */
document.addEventListener('DOMContentLoaded', () => {
  //-----------------------------------------------------------------------------------------------
  // FADE IN NEW CONTENT
  // - Fade the new content in, fade the old one out.
  function animate(oldContent, newContent) {
    function removeOldContent() {
      oldContent.parentNode.removeChild(oldContent);
      newContent.classList.remove('animateOpacity');
    }
    oldContent.style.position = 'absolute';
    newContent.addEventListener('animationend', removeOldContent);
    newContent.classList.add('animateOpacity');
    anchorListeners();
  }
  //-----------------------------------------------------------------------------------------------
  // FETCH THE HTML FROM THE HREF
  // - Fetches the html based on the href and saves the Promise (object) in the cache variable.
  // - If the cache exists, if will use that instead of making a request.
  // - Can use the Cache API as well.
  const cache = {};
  function loadPage(url) {
    if (cache[url]) {
      console.log(cache);
      return new Promise((resolve) => {
        resolve(cache[url]);
      });
    }
    return fetch(url, {
      method: 'GET'
    }).then((response) => {
      cache[url] = response.text();
      console.log(cache);
      return cache[url];
    });
  }
  //-----------------------------------------------------------------------------------------------
  // APPEND THE FETCHED-HTML TO THE CURRENT PAGE
  // - Function to fetch html, appends it, and activate the animate function.
  function changePage() {
    const url = window.location.href;
    const main = document.querySelector('main');
    loadPage(url).then((responseText) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = responseText;
      const oldContent = document.querySelector('.mainWrapper');
      const newContent = wrapper.querySelector('.mainWrapper');
      main.appendChild(newContent);
      animate(oldContent, newContent);
    });
  }
  //-----------------------------------------------------------------------------------------------
  // GET THE HREF FROM THE ANCHOR
  // - Since e.target might be an img/svg wrapped in an anchor element.
  // - We need to ascend the nodelist to find where el.href = true.
  function getAnchor(e) {
    let el = e.target;
    while (el && !el.href) {
      el = el.parentNode;
    }
    if (el) {
      e.preventDefault();
      history.pushState(null, null, el.href); // Modify current url to become url of link.
      changePage();
    }
  }
  //-----------------------------------------------------------------------------------------------
  // EXPERIMENTAL / ON MOUSEOVER FETCH THE HTML FROM THE HREF AND LOCAL-CACHE IT
  // - Function is called on initial load & after animate() to bind the listener.
  // - This is just a simple one so not certain how effective it will be in real-world case.
  function anchorListeners() {
    const allAnchors = Array.from(document.querySelectorAll('a'));
    const anchors = allAnchors.filter(a => (a.classList.contains('currentPage') === false));
    function cachePage(e) {
      loadPage(e.target.href);
    }
    anchors.forEach(a => a.addEventListener('mouseover', cachePage));
  };
  anchorListeners();
  //-----------------------------------------------------------------------------------------------
  document.addEventListener('click', getAnchor); // Intercept any clicks that are anchor related.
  window.addEventListener('popstate', changePage); // Fires when  active history entry changes.
  //-----------------------------------------------------------------------------------------------
});
