// LinkedIn Game Changer Filter - Content Script

(function() {
    'use strict';
    
    // Keywords to filter out (insensitive case for insensitive posts))
    const filteredKeywords = [
        'game changer',
        'swarm', // Test, using https://www.linkedin.com/feed/update/urn:li:activity:7351115423532109825/ , Adrians post, mentioning "swarm" should be hidden
        'game-changer',
        'gamechanger'
    ];

    // Find mofos
    function containsFilteredKeywords(text) {
        const lowerText = text.toLowerCase();
        return filteredKeywords.some(keyword => lowerText.includes(keyword));
    }
    
    // Hide mofos
    function hidePost(postElement) {
        postElement.style.display = 'none';
        console.log('Hidden post containing filtered keyword');
    }
    
    // Filter mofos
    function filterPosts() {
        const postSelectors = [
            'div[data-id^="urn:li:activity"]',
            '.feed-shared-update-v2',
            '.occludable-update',
            'div.feed-shared-update-v2'
        ];
        
        postSelectors.forEach(selector => {
            const posts = document.querySelectorAll(selector);
            
            posts.forEach(post => {
                if (post.hasAttribute('data-filtered-checked')) {
                    return;
                }
                post.setAttribute('data-filtered-checked', 'true');
                
                const postText = post.textContent || post.innerText || '';

                // Has mofo
                if (containsFilteredKeywords(postText)) {
                    hidePost(post);
                }
            });
        });
    }
    
    // Initial filter
    filterPosts();
    
    // Yell, if you find mofo
    const observer = new MutationObserver(function(mutations) {
        let shouldFilter = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if new nodes contain posts
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        shouldFilter = true;
                    }
                });
            }
        });
        
        if (shouldFilter) {
            // Debounce mofo
            clearTimeout(window.filterTimeout);
            window.filterTimeout = setTimeout(filterPosts, 100);
        }
    });
    
    // observe mofos
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Filter when scrolling (in case posts are lazy loaded)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(filterPosts, 200);
    });
    
    console.log('LinkedIn Game Changer Filter loaded');
})();
