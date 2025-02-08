function moveCurrentTab(direction: 'left' | 'right') {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const tabIndex = tabs.findIndex((tab) => tab.active);
    if (tabIndex < 0) {
      console.debug('No active tab found');
      return;
    }
    const tabId = tabs[tabIndex].id;
    if (tabIndex < 0 || tabId === undefined) {
      return;
    }

    /** First index this tab may be moved to. If pinned, it's zero. If not pinned, it's the first non-pinned tab index. */
    const firstValidIndex = tabs[tabIndex].pinned
      ? 0
      : tabs.filter((tab) => !!tab.pinned).length;

    /** Last index this tab may be moved to. If pinned, it can't go beyond the pinned tabs. If not pinned, it can go all the way to the end of the tab list.  */
    const lastValidIndex = tabs[tabIndex].pinned
      ? tabs.filter((tab) => !!tab.pinned).length - 1
      : tabs.length - 1;

    let newIndex = tabIndex + (direction === 'left' ? -1 : 1);
    if (newIndex < firstValidIndex) {
      newIndex = lastValidIndex;
    } else if (newIndex > lastValidIndex) {
      newIndex = firstValidIndex;
    }

    chrome.tabs.move(tabId, { index: newIndex });
  });
}

function moveCurrentTabGroup(direction: 'left' | 'right') {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const tabIndex = tabs.findIndex((tab) => tab.active);
    const tab = tabs[tabIndex];
    if (tabIndex < 0 || tab.id === undefined) {
      console.debug('No active tab found');
      return;
    }

    /** First index this tab/group may be moved to. If pinned, it's zero. If not pinned, it's the first non-pinned tab index. */
    const firstValidIndex = tabs[tabIndex].pinned
      ? 0
      : tabs.filter((tab) => !!tab.pinned).length;

    /** Last index this tab may be moved to. If pinned, it can't go beyond the pinned tabs. If not pinned, it can go all the way to the end of the tab list.  */
    const lastValidIndex = tabs[tabIndex].pinned
      ? tabs.filter((tab) => !!tab.pinned).length - 1
      : tabs.length - 1;

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
        tabIndexInGroupToSwapWith < firstValidIndex ||
        tabIndexInGroupToSwapWith > lastValidIndex
      ) {
        // If the group has been moved off the edge of the window, wrap it to the other side
        if (tab.groupId >= 0) {
          chrome.tabGroups.move(tab.groupId, {
            index:
              direction === 'right'
                ? firstValidIndex
                : lastValidIndex + 1 - tabsInCurrentGroup.length,
          });
        } else {
          // Tab is ungrouped, move as normal
          moveCurrentTab(direction);
        }

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

function moveCurrentTabToWindow(direction: 'previous' | 'next') {
  chrome.windows.getAll({ windowTypes: ['normal'] }, (allWindows) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || tabs.length > 1) {
        console.debug('No active tab found', tabs.length);
        return;
      }
      const tabId = tabs[0].id;
      if (tabId === undefined) {
        console.debug('No tab id found');
        return;
      }
      const windowId = tabs[0].windowId;

      const isIncognito = allWindows.find(
        (window) => window.id === windowId
      )?.incognito;

      const windows = allWindows.filter(
        (window) => window.incognito === isIncognito
      );
      if (windows.length <= 1) {
        console.debug('Only one window found');
        return;
      }

      const currentWindowIndex = windows.findIndex(
        (window) => window.id === windowId
      );

      let destinationWindowIndex =
        direction === 'previous'
          ? currentWindowIndex - 1
          : currentWindowIndex + 1;
      if (destinationWindowIndex < 0) {
        destinationWindowIndex = windows.length - 1;
      } else if (destinationWindowIndex >= windows.length) {
        destinationWindowIndex = 0;
      }
      const destinationWindowId = windows[destinationWindowIndex].id;
      if (destinationWindowId === undefined) {
        console.debug('No destination window id found');
        return;
      }
      chrome.tabs.move(tabId, { windowId: destinationWindowId, index: -1 });
      chrome.tabs.update(tabId, { active: true });
      chrome.windows.update(destinationWindowId, { focused: true });
    });
  });
}

function moveCurrentTabGroupToWindow(direction: 'previous' | 'next') {
  chrome.windows.getAll({ windowTypes: ['normal'] }, (allWindows) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || tabs.length > 1) {
        console.debug('No active tab found', tabs.length);
        return;
      }
      const currentTab = tabs[0];
      const tabId = currentTab.id;
      if (tabId === undefined) {
        console.debug('No tab id found');
        return;
      }
      const windowId = currentTab.windowId;

      const isIncognito = allWindows.find(
        (window) => window.id === windowId
      )?.incognito;

      const windows = allWindows.filter(
        (window) => window.incognito === isIncognito
      );
      if (windows.length <= 1) {
        console.debug('Only one window found');
        return;
      }

      const currentWindowIndex = windows.findIndex(
        (window) => window.id === windowId
      );

      let destinationWindowIndex =
        direction === 'previous'
          ? currentWindowIndex - 1
          : currentWindowIndex + 1;
      if (destinationWindowIndex < 0) {
        destinationWindowIndex = windows.length - 1;
      } else if (destinationWindowIndex >= windows.length) {
        destinationWindowIndex = 0;
      }
      const destinationWindowId = windows[destinationWindowIndex].id;
      if (destinationWindowId === undefined) {
        console.debug('No destination window id found');
        return;
      }
      if (currentTab.groupId >= 0) {
        chrome.tabGroups.move(currentTab.groupId, {
          windowId: destinationWindowId,
          index: -1,
        });
      } else {
        chrome.tabs.move(tabId, { windowId: destinationWindowId, index: -1 });
      }
      chrome.tabs.update(tabId, { active: true });
      chrome.windows.update(destinationWindowId, { focused: true });
    });
  });
}

function ungroupCurrentTab() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const tab = tabs[0];
    if (tab?.id === undefined) {
      return;
    }

    chrome.tabs.ungroup(tab.id);
  });
}

function toggleCurrentTabPinned() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const tab = tabs[0];
    if (tab?.id === undefined) {
      return;
    }

    chrome.tabs.update(tab.id, { pinned: !tab.pinned });
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
    case 'move-tab-to-previous-window':
      moveCurrentTabToWindow('previous');
      break;
    case 'move-tab-to-next-window':
      moveCurrentTabToWindow('next');
      break;
    case 'move-tab-group-to-previous-window':
      moveCurrentTabGroupToWindow('previous');
      break;
    case 'move-tab-group-to-next-window':
      moveCurrentTabGroupToWindow('next');
      break;
    case 'ungroup-tab':
      ungroupCurrentTab();
      break;
    case 'toggle-tab-pinned':
      toggleCurrentTabPinned();
      break;
  }
});
