// global variables
const hidden = "hidden";
const active = "active";

const doc = document.documentElement;
const parentURL = window.location.protocol + "//" + window.location.host + "/";
const staticman = Object.create(null);
const translations = {
  success: {
    title: 'Review submitted',
    text: 'Thanks for your review! It will be shown on the site once it has been approved.',
    close: 'Close'
  },
  error: {
    title: 'Error',
    text: 'Sorry, there was an error with the submission!',
    close: 'Close'
  },
  discard: {
    title: 'Discard Comment',
    button: 'discard'
  },
  submit: 'Submit',
  submitted: 'Submitted'
};

const tAddress = 'Address';

;
function isObj(obj) {
  return (obj && typeof obj === 'object' && obj !== null) ? true : false;
}

function createEl(element = 'div') {
  return document.createElement(element);
}

function elem(selector, parent = document){
  let elem = parent.querySelector(selector);
  return elem != false ? elem : false;
}

function elems(selector, parent = document) {
  let elems = parent.querySelectorAll(selector);
  return elems.length ? elems : false;
}

function pushClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? false : elClass.add(targetClass);
  }
}

function deleteClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : false;
  }
}

function modifyClass(el, targetClass) {
  if (isObj(el) && targetClass) {
    elClass = el.classList;
    elClass.contains(targetClass) ? elClass.remove(targetClass) : elClass.add(targetClass);
  }
}

function containsClass(el, targetClass) {
  if (isObj(el) && targetClass && el !== document ) {
    return el.classList.contains(targetClass) ? true : false;
  }
}

function isChild(node, parentClass) {
  let objectsAreValid = isObj(node) && parentClass && typeof parentClass == 'string';
  return (objectsAreValid && node.closest(parentClass)) ? true : false;
}

function getSiblings(el) {
  return Array.prototype.filter.call(el.parentNode.children, function(child){
    return child !== el;
  });
}

function markActive(el, activeClass = active) {
  const siblings = getSiblings(el);
  pushClass(el, activeClass);
  if(siblings.length) {
    siblings.forEach(element => deleteClass(element, activeClass));
  }
}

function elemAttribute(elem, attr, value = null) {
  if (value) {
    elem.setAttribute(attr, value);
  } else {
    value = elem.getAttribute(attr);
    return value ? value : false;
  }
}

function deleteChars(str, subs) {
  let newStr = str;
  if (Array.isArray(subs)) {
    for (let i = 0; i < subs.length; i++) {
      newStr = newStr.replace(subs[i], '');
    }
  } else {
    newStr = newStr.replace(subs, '');
  }
  return newStr;
}

function isBlank(str) {
  return (!str || str.trim().length === 0);
}

function isMatch(element, selectors) {
  if(isObj(element)) {
    if(selectors.isArray) {
      let matching = selectors.map(function(selector){
        return element.matches(selector)
      })
      return matching.includes(true);
    }
    return element.matches(selectors)
  }
}

function exactMatch(target, criteria) {
  const isTarget = target.matches(criteria);
  const isWithinTarget = target.closest(criteria);
  return isTarget ? isTarget : isWithinTarget;;
}

const copyToClipboard = str => {
  let copy, selection, selected;
  copy = createEl('textarea');
  copy.value = str;
  copy.setAttribute('readonly', '');
  copy.style.position = 'absolute';
  copy.style.left = '-9999px';
  selection = document.getSelection();
  doc.appendChild(copy);
  // check if there is any selected content
  selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
  copy.select();
  document.execCommand('copy');
  doc.removeChild(copy);
  if (selected) { // if a selection existed before copying
    selection.removeAllRanges(); // unselect existing selection
    selection.addRange(selected); // restore the original selection
  }
}

function convertToUnderScoreCase(str) {
  let char, newChar, newStr;
  newStr = '';
  if (typeof str == 'string') {
    for (let x = 0; x < str.length; x++) {
      char = str.charAt(x);
      if (char.match(/^[A-Z]*$/)) {
        char = char.toLowerCase();
        newChar = `_${char}`
        newStr += newChar;
      } else {
        newStr += char;
      }
    }
    return newStr;
  }
}

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}
;
function fileClosure(){ 
  // everything in this file should be declared within this closure (function).

  (function updateDate() {
    var date = new Date();
    var year = date.getFullYear();
    elem('.year').innerHTML = year;
  })();

  (function() {
    let bar = 'nav_bar-wrap';
    let navBar = elem(`.${bar}`);
    let nav = elem('.nav-body');
    let open = 'nav-open';
    let exit = 'nav-exit';
    let drop = 'nav-drop';
    let pop = 'nav-pop';
    let navDrop = elem(`.${drop}`);

    function toggleMenu(){
      let menuOpen, menuPulled, status;
      modifyClass(navDrop, pop);
      modifyClass(navBar, hidden);
      menuOpen = containsClass(nav, open);
      menuPulled = containsClass(nav, exit);

      status = menuOpen || menuPulled ? true : false;

      status ? modifyClass(nav, exit) : modifyClass(nav, open);
      status ? modifyClass(nav, open) : modifyClass(nav, exit);
    }

    navBar.addEventListener('click', function() {
      toggleMenu();
    });
    elem('.nav-close').addEventListener('click', function() {
      toggleMenu();
    });

    elem('.nav-drop').addEventListener('click', function(e) {
      e.target === this ? toggleMenu() : false;
    });

  })();

  (function makeExternalLinks(){
    let links = elems('a');
    if(links) {
      Array.from(links).forEach(function(link){
        let target, rel, blank, noopener, attr1, attr2, url, isExternal;
        url = elemAttribute(link, 'href');
        isExternal = (url && typeof url == 'string' && url.startsWith('http')) && !url.startsWith(parentURL) ? true : false;
        if(isExternal) {
          target = 'target';
          rel = 'rel';
          blank = '_blank';
          noopener = 'noopener';
          attr1 = elemAttribute(link, target);
          attr2 = elemAttribute(link, noopener);

          attr1 ? false : elemAttribute(link, target, blank);
          attr2 ? false : elemAttribute(link, rel, noopener);
        }
      });
    }
  })();

  let headingNodes = [], results, link, icon, current, id,
  tags = ['h2', 'h3', 'h4', 'h5', 'h6'];

  current = document.URL;

  tags.forEach(function(tag){
    results = document.getElementsByTagName(tag);
    Array.prototype.push.apply(headingNodes, results);
  });

  headingNodes.forEach(function(node){
    link = createEl('a');
    icon = createEl('img');
    icon.src = 'https://president810.github.io/Cpp-Interview-Notes/images/icons/link.svg';
    link.className = 'link';
    link.appendChild(icon);
    id = node.getAttribute('id');
    if(id) {
      link.href = `${current}#${id}`;
      node.appendChild(link);
      pushClass(node, 'link_owner');
    }
  });

  let inlineListItems = elems('ol li');
  if(inlineListItems) {
    inlineListItems.forEach(function(listItem){
      let firstChild = listItem.children[0]
      let containsHeading = isMatch(firstChild, tags);
      containsHeading ? pushClass(listItem, 'align') : false;
    })
  }

  (function copyHeadingLink() {
    let deeplink, deeplinks, newLink, parent, target;
    deeplink = 'link';
    deeplinks = elems(`.${deeplink}`);
    if(deeplinks) {
      document.addEventListener('click', function(event)
      {
        target = event.target;
        parent = target.parentNode;
        if (target && containsClass(target, deeplink) || containsClass(parent, deeplink)) {
          event.preventDefault();
          newLink = target.href != undefined ? target.href : target.parentNode.href;
          copyToClipboard(newLink);
        }
      });
    }
  })();

  (function copyLinkToShare() {
    let  copy, copied, excerpt, isCopyIcon, isInExcerpt, link, postCopy, postLink, target;
    copy = 'copy';
    copied = 'copy_done';
    excerpt = 'excerpt';
    postLink = 'post_card';

    doc.addEventListener('click', function(event) {
      target = event.target;
      isCopyIcon = containsClass(target, copy);
      let isWithinCopyIcon = target.closest(`.${copy}`);
      if (isCopyIcon || isWithinCopyIcon) {
        let icon = isCopyIcon ? isCopyIcon : isWithinCopyIcon;
        isInExcerpt = icon.closest(`.${excerpt}`);
        if (isInExcerpt) {
          link = target.closest(`.${excerpt}`).previousElementSibling;
          link = containsClass(link, postLink)? elemAttribute(link, 'href') : false;
        } else {
          link = window.location.href;
        }
        if(link) {
          copyToClipboard(link);
          pushClass(icon, copied);
        }
      }
    });
  })();

  (function hideAside(){
    let aside, title, posts;
    aside = elem('.aside');
    title = aside ? aside.previousElementSibling : null;
    if(aside && title.nodeName.toLowerCase() === 'h3') {
      posts = Array.from(aside.children);
      posts.length < 1 ? title.remove() : false;
    }
  })();

  (function goBack() {
    let backBtn = elem('.btn_back');
    let history = window.history;
    if (backBtn) {
      backBtn.addEventListener('click', function(){
        history.back();
      });
    }
  })();

  (function postsPager(){
    const pager = elem('.pagination');
    if (pager) {
      pushClass(pager, 'pager');
      const pagerItems = elems('li', pager);
      const pagerLinks = Array.from(pagerItems).map(function(item){
        return item.firstElementChild;
      });

      pagerLinks.forEach(function(link){
        pushClass(link, 'pager_link')
      });

      pagerItems.forEach(function(item){
        pushClass(item, 'pager_item')
      });
    }
  })();

  (function lazy() {
    function lazyLoadMedia(element) {
      let mediaItems = elems(element);
      if(mediaItems) {
        Array.from(mediaItems).forEach(function(item) {
        item.loading = "lazy";
        });
      }
    }
    lazyLoadMedia('iframe');
    lazyLoadMedia('img');
  })();

  const qr = elem(".crypto_qr");

  function cryptoAddressQR(address, el = qr) {
    const qrCode = new QRious({ element: el, size: 225, value: address});
    qrCode.set({
      foreground: "#ef7f1a",
      size: 225,
    });
  }

  function activeCryptoTitle(el) {
    const cryptoTitle = `${el.dataset.title} ${tAddress}`;  
    const cryptoTitleEl = elem(".crypto_title");
    cryptoTitleEl.textContent = cryptoTitle;
  }

  const cryptoRow = ".crypto_row";

  doc.addEventListener('click', function(event){
    const target = event.target;
    const cryptoCopy = ".crypto_copy";
    const cryptoScan = ".crypto_scan";
    const isCrypto = exactMatch(target, cryptoRow);
    if(qr) {
      const cryptoPad = qr.parentNode;
      if(isCrypto) {
        const isCopyCrypto = exactMatch(target, cryptoCopy);
        const isScanCrypto = exactMatch(target, cryptoScan);
        if(isCrypto.dataset) {
          const address = isCrypto.dataset.address;
          isCopyCrypto ? copyToClipboard(address) : false;
          isScanCrypto ? pushClass(cryptoPad, active) : false;
          markActive(isCrypto);
          cryptoAddressQR(address);
          activeCryptoTitle(isCrypto);
        }
      } else {
        containsClass(cryptoPad, active) ? modifyClass(cryptoPad, active) : false;
      }
    }
  });

  let applied = false;
  // let fadedUp = false;
  // let fadedSideways = false;
  const toFade = elems(".fp");
  const toFadeSideways = elems(".fs");
  window.addEventListener("scroll", () => {
    if(toFade.length) {
      toFade.forEach((el) => {
        let blockInPosition = elementInViewport(el);
        if(blockInPosition) {
          pushClass(el, "fade_up");
        }
      })
    }

    if(toFadeSideways.length) {
      toFadeSideways.forEach((el) => {
        let blockInPosition = elementInViewport(el);
        if(blockInPosition) {
          pushClass(el, "fade_left");
        }
      })
    }
  });

  // add new code above this line
}
window.addEventListener('load', fileClosure());
