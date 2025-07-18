// LinkedIn Game Changer Filter - Content Script

(function() {
    'use strict';
    
    // Keywords to filter out (case insensitive)
    const filteredKeywords = [
        'game changer',
        'swarm', // Test, by going to https://www.linkedin.com/feed/update/urn:li:activity:7351115423532109825/ , Adrians post, mentioning "swarm" should be hidden
        'game-changer',
        'gamechanger'
    ];
    
    // Function to check if text contains filtered keywords
    function containsFilteredKeywords(text) {
        const lowerText = text.toLowerCase();
        return filteredKeywords.some(keyword => lowerText.includes(keyword));
    }
    
    // Function to hide a post
    function hidePost(postElement) {
        postElement.style.display = 'none';
        console.log('Hidden post containing filtered keyword');
    }
    
    // Function to filter posts
    function filterPosts() {
        // LinkedIn post selectors (these may need updates if LinkedIn changes their structure)
        const postSelectors = [
            'div[data-id^="urn:li:activity"]',
            '.feed-shared-update-v2',
            '.occludable-update',
            'div.feed-shared-update-v2'
        ];
        
        postSelectors.forEach(selector => {
            const posts = document.querySelectorAll(selector);
            
            posts.forEach(post => {
                // Skip if already processed
                if (post.hasAttribute('data-filtered-checked')) {
                    return;
                }
                
                // Mark as processed
                post.setAttribute('data-filtered-checked', 'true');
                
                // Get post text content
                const postText = post.textContent || post.innerText || '';
                
                // Check if post contains filtered keywords
                if (containsFilteredKeywords(postText)) {
                    hidePost(post);
                }
            });
        });
    }
    
    // Initial filter
    filterPosts();
    
    // Create observer for new posts loaded dynamically
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
            // Debounce filtering to avoid excessive calls
            clearTimeout(window.filterTimeout);
            window.filterTimeout = setTimeout(filterPosts, 100);
        }
    });
    
    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Also filter when scrolling (in case posts are lazy loaded)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(filterPosts, 200);
    });
    
    console.log('LinkedIn Game Changer Filter loaded');
})();
