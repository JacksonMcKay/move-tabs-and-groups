function moveCurrentTab(direction: 'left' | 'right') {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const tabIndex = tabs.findIndex((tab) => tab.active);
    const tabId = tabs[tabIndex].id;
    if (tabIndex < 0 || tabId === undefined) {
      return;
    }

    let newIndex = tabIndex + (direction === 'left' ? -1 : 1);
    if (newIndex < 0) {
      newIndex = tabs.length - 1;
    } else if (newIndex >= tabs.length) {
      newIndex = 0;
    }

    chrome.tabs.move(tabId, { index: newIndex });
  });
}

function moveCurrentTabGroup(direction: 'left' | 'right') {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const tabIndex = tabs.findIndex((tab) => tab.active);
    const tab = tabs[tabIndex];
    if (tabIndex < 0 || tab.id === undefined) {
      return;
    }

    chrome.tabs.query({ groupId: tab.groupId }, (_tabsInCurrentGroup) => {
      const tabsInCurrentGroup =
        tab.groupId !== -1 ? _tabsInCurrentGroup : [tab];
      const startIndexInCurrentGroup = tabsInCurrentGroup[0].index;

      let tabIndexInGroupToSwapWith;
      if (direction === 'left') {
        tabIndexInGroupToSwapWith = tabsInCurrentGroup[0].index - 1;
      } else {
        tabIndexInGroupToSwapWith =
          tabsInCurrentGroup[tabsInCurrentGroup.length - 1].index + 1;
      }

      if (
        tabIndexInGroupToSwapWith < 0 ||
        tabIndexInGroupToSwapWith >= tabs.length
      ) {
        // If the group has been moved off the edge of the window, wrap it to the other side
        chrome.tabGroups.move(tab.groupId, {
          index:
            direction === 'right' ? 0 : tabs.length - tabsInCurrentGroup.length,
        });

        return;
      }

      const groupIdToSwapWith = tabs[tabIndexInGroupToSwapWith].groupId;
      chrome.tabs.query(
        { groupId: groupIdToSwapWith },
        (_tabsInGroupToSwapWith) => {
          const tabsInGroupToSwapWith =
            groupIdToSwapWith !== -1
              ? _tabsInGroupToSwapWith
              : [tabs[tabIndexInGroupToSwapWith]];
          const indexToMoveTo =
            direction === 'left'
              ? tabsInGroupToSwapWith[0].index
              : startIndexInCurrentGroup + tabsInGroupToSwapWith.length;

          if (tab.groupId >= 0) {
            chrome.tabGroups.move(tab.groupId, { index: indexToMoveTo });
          } else {
            chrome.tabs.move(tab.id!, { index: indexToMoveTo });
          }
        }
      );
    });
  });
}

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case 'move-tab-left':
      moveCurrentTab('left');
      break;
    case 'move-tab-right':
      moveCurrentTab('right');
      break;
    case 'move-tab-group-left':
      moveCurrentTabGroup('left');
      break;
    case 'move-tab-group-right':
      moveCurrentTabGroup('right');
      break;
  }
});
