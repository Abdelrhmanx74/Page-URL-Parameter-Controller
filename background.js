chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    const url = new URL(currentTab.url);

    // Check for common page parameter names
    const pageParamNames = [
      "page",
      "p",
      "pg",
      "pagination",
      "page_num",
      "page_number",
      "page_no",
      "page_no.",
      "page_no_",
      "pgn",
    ];
    let pageParam = null;
    let usedParamName = null;

    // Find the first page parameter that exists in the URL
    for (const paramName of pageParamNames) {
      if (url.searchParams.has(paramName)) {
        pageParam = parseInt(url.searchParams.get(paramName));
        usedParamName = paramName;
        break;
      }
    }

    // Default to page=1 if no page parameter found
    if (pageParam === null) {
      pageParam = 1;
      usedParamName = "page"; // Default to 'page' if no parameter exists
    }

    if (command === "increase-page") {
      pageParam++;
    } else if (command === "decrease-page") {
      pageParam = Math.max(1, pageParam - 1);
    }

    url.searchParams.set(usedParamName, pageParam);
    chrome.tabs.update(currentTab.id, { url: url.toString() });
  });
});
