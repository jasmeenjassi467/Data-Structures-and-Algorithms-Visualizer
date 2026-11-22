/**
 * DSA Visualizer - Interactive Learning Engine
 * Implements equivalent JavaScript algorithmic logic for browser demonstration.
 * Full state management for Stack, Queue, Linked List, and Binary Search Tree.
 */

// =============================================================================
// GLOBAL NAVIGATION & UI CONTROLLER
// =============================================================================

const titlesMap = {
  'dashboard': { title: 'Dashboard Overview', subtitle: 'Select any data structure to interact with visual animations and algorithm steps.' },
  'stack-section': { title: 'Stack Visualizer', subtitle: 'LIFO (Last In First Out) • Element push, pop, peek, and capacity boundary monitoring.' },
  'queue-section': { title: 'Queue Visualizer', subtitle: 'FIFO (First In First Out) • Enqueue at rear, dequeue from front, pointer tracking.' },
  'linkedlist-section': { title: 'Singly Linked List Visualizer', subtitle: 'Dynamic memory nodes connected via pointer addresses.' },
  'bst-section': { title: 'Binary Search Tree Visualizer', subtitle: 'Hierarchical node layout with L < Root < R property and depth-first traversals.' },
  'cpp-code-section': { title: 'C++ Source Code Reference', subtitle: 'Complete authentic C++ header and source files for academic grading and compilation.' },
  'about-section': { title: 'About Project & Complexity Matrix', subtitle: 'Project documentation, complexity comparisons, and verification steps.' }
};

function navigateTo(targetId) {
  // Update section visibility
  document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
  const targetSec = document.getElementById(targetId);
  if (targetSec) targetSec.classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
  });

  // Update headers
  const meta = titlesMap[targetId] || { title: 'DSA Visualizer', subtitle: '' };
  document.getElementById('pageTitle').textContent = meta.title;
  document.getElementById('pageSubtitle').textContent = meta.subtitle;

  // Close mobile sidebar if open
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global Toast System
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Execution Tracer Logger
function addLog(containerId, message, type = 'info') {
  const logContainer = document.getElementById(containerId);
  if (!logContainer) return;

  const entry = document.createElement('div');
  entry.className = `log-entry log-${type}`;
  const time = new Date().toLocaleTimeString();
  entry.textContent = `[${time}] ${message}`;

  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

// Clear log helper
function setupLogClear(btnId, logId, defaultMsg) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  btn.addEventListener('click', () => {
    const log = document.getElementById(logId);
    if (log) {
      log.innerHTML = `<div class="log-entry log-system">${defaultMsg}</div>`;
      showToast('Execution log cleared', 'info', 1500);
    }
  });
}


// =============================================================================
// MODULE 1: STACK IMPLEMENTATION & VISUALIZATION (LIFO)
// =============================================================================

const StackVisualizer = (function() {
  const MAX_CAPACITY = 8;
  let items = [];

  function updateUI() {
    const sizeBadge = document.getElementById('stackSizeBadge');
    const topBadge = document.getElementById('stackTopBadge');
    const pointer = document.getElementById('stackTopPointer');

    sizeBadge.textContent = `Size: ${items.length} / ${MAX_CAPACITY}`;
    if (items.length === 0) {
      topBadge.textContent = 'TOP: -1 (Empty)';
      topBadge.className = 'badge badge-outline';
      pointer.style.bottom = '0px';
    } else {
      topBadge.textContent = `TOP: Index [${items.length - 1}]`;
      topBadge.className = 'badge badge-accent';
      // Each slot is 30px height + 3px margin = 33px offset
      const bottomOffset = (items.length - 1) * 33 + 6;
      pointer.style.bottom = `${bottomOffset}px`;
    }

    // Re-render slots
    const slots = document.querySelectorAll('#stackContainer .stack-slot');
    slots.forEach(slot => {
      const idx = parseInt(slot.getAttribute('data-index'), 10);
      const existingEl = slot.querySelector('.stack-element');

      if (idx < items.length) {
        if (!existingEl) {
          const el = document.createElement('div');
          el.className = 'stack-element' + (idx === items.length - 1 ? ' is-top' : '');
          el.textContent = items[idx];
          slot.appendChild(el);
        } else {
          existingEl.textContent = items[idx];
          existingEl.className = 'stack-element' + (idx === items.length - 1 ? ' is-top' : '');
        }
      } else {
        if (existingEl) existingEl.remove();
      }
    });
  }

  function push(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') {
      showToast('Please enter a valid integer to push.', 'warning');
      return;
    }
    const num = parseInt(val, 10);

    if (items.length >= MAX_CAPACITY) {
      showToast(`Stack Overflow! Maximum capacity (${MAX_CAPACITY}) reached.`, 'error');
      addLog('stackLog', `Stack Overflow: Cannot push ${num}. Stack is full.`, 'error');
      return;
    }

    // Algorithm micro-steps
    addLog('stackLog', `Step 1: Check capacity (size: ${items.length} < max: ${MAX_CAPACITY}). Stack has space.`, 'info');
    addLog('stackLog', `Step 2: Increment top pointer to index [${items.length}].`, 'info');
    items.push(num);
    updateUI();
    addLog('stackLog', `Step 3: Stored value ${num} at stack[top]. Push complete.`, 'success');
    showToast(`Pushed ${num} onto stack.`, 'success');
  }

  function pop() {
    if (items.length === 0) {
      showToast('Stack Underflow! Stack is already empty.', 'error');
      addLog('stackLog', 'Stack Underflow: Cannot pop from an empty stack.', 'error');
      return;
    }

    const topIndex = items.length - 1;
    const poppedVal = items[topIndex];
    addLog('stackLog', `Step 1: Read value at top index [${topIndex}] -> ${poppedVal}.`, 'info');

    // Trigger visual pop animation
    const slot = document.querySelector(`#stackContainer .stack-slot[data-index="${topIndex}"]`);
    const element = slot ? slot.querySelector('.stack-element') : null;

    if (element) {
      element.classList.add('popping');
      setTimeout(() => {
        items.pop();
        addLog('stackLog', `Step 2: Decrement top pointer to index [${items.length - 1}].`, 'info');
        addLog('stackLog', `Step 3: Removed ${poppedVal} successfully. Pop complete.`, 'success');
        updateUI();
        showToast(`Popped ${poppedVal} from stack.`, 'info');
      }, 300);
    } else {
      items.pop();
      updateUI();
    }
  }

  function peek() {
    if (items.length === 0) {
      showToast('Stack is empty! Nothing to peek.', 'warning');
      addLog('stackLog', 'Peek called on empty stack (top == -1).', 'warning');
      return;
    }

    const topIndex = items.length - 1;
    const topVal = items[topIndex];
    addLog('stackLog', `Peek: Inspected top element at index [${topIndex}] -> ${topVal} (Stack remains unchanged).`, 'info');

    const slot = document.querySelector(`#stackContainer .stack-slot[data-index="${topIndex}"]`);
    const element = slot ? slot.querySelector('.stack-element') : null;
    if (element) {
      element.classList.remove('peeking');
      void element.offsetWidth; // Force reflow
      element.classList.add('peeking');
    }
    showToast(`Top element: ${topVal} at index [${topIndex}]`, 'info');
  }

  function reset() {
    items = [];
    updateUI();
    addLog('stackLog', 'Stack reset to empty state. top = -1, size = 0.', 'system');
    showToast('Stack reset successfully.', 'info');
  }

  function randomPush() {
    const rand = Math.floor(Math.random() * 90) + 10;
    push(rand);
  }

  return { push, pop, peek, reset, randomPush };
})();


// =============================================================================
// MODULE 2: QUEUE IMPLEMENTATION & VISUALIZATION (FIFO)
// =============================================================================

const QueueVisualizer = (function() {
  const MAX_CAPACITY = 8;
  let items = [];

  function initSlots() {
    const track = document.getElementById('queueTrack');
    if (!track) return;
    track.innerHTML = '';
    for (let i = 0; i < MAX_CAPACITY; i++) {
      const slot = document.createElement('div');
      slot.className = 'queue-slot';
      slot.setAttribute('data-index', i);
      slot.innerHTML = `<span class="queue-slot-idx">[${i}]</span>`;
      track.appendChild(slot);
    }
  }

  function updateUI() {
    const sizeBadge = document.getElementById('queueSizeBadge');
    const pointersBadge = document.getElementById('queuePointersBadge');

    sizeBadge.textContent = `Size: ${items.length} / ${MAX_CAPACITY}`;
    if (items.length === 0) {
      pointersBadge.textContent = 'Front: -1 | Rear: -1 (Empty)';
    } else {
      pointersBadge.textContent = `Front: [0] | Rear: [${items.length - 1}]`;
    }

    const slots = document.querySelectorAll('#queueTrack .queue-slot');
    slots.forEach(slot => {
      const idx = parseInt(slot.getAttribute('data-index'), 10);
      const existingEl = slot.querySelector('.queue-element');
      const existingLabel = slot.querySelector('.queue-pointer-label');
      if (existingLabel) existingLabel.remove();

      if (idx < items.length) {
        if (!existingEl) {
          const el = document.createElement('div');
          el.className = 'queue-element';
          el.textContent = items[idx];
          slot.appendChild(el);
        } else {
          existingEl.textContent = items[idx];
          existingEl.className = 'queue-element';
        }

        // Apply pointers
        if (idx === 0) {
          slot.querySelector('.queue-element').classList.add('is-front');
          const frontLabel = document.createElement('span');
          frontLabel.className = 'queue-pointer-label queue-pointer-front';
          frontLabel.textContent = 'FRONT';
          slot.appendChild(frontLabel);
        }
        if (idx === items.length - 1) {
          slot.querySelector('.queue-element').classList.add('is-rear');
          const rearLabel = document.createElement('span');
          rearLabel.className = 'queue-pointer-label queue-pointer-rear';
          rearLabel.textContent = 'REAR';
          slot.appendChild(rearLabel);
        }
      } else {
        if (existingEl) existingEl.remove();
      }
    });
  }

  function enqueue(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') {
      showToast('Please enter a valid integer to enqueue.', 'warning');
      return;
    }
    const num = parseInt(val, 10);

    if (items.length >= MAX_CAPACITY) {
      showToast(`Queue Overflow! Capacity (${MAX_CAPACITY}) reached.`, 'error');
      addLog('queueLog', `Queue Overflow: Cannot enqueue ${num}. Queue is full.`, 'error');
      return;
    }

    addLog('queueLog', `Step 1: Check capacity (size: ${items.length} < max: ${MAX_CAPACITY}). Queue has free slots.`, 'info');
    addLog('queueLog', `Step 2: Advance rear pointer to index [${items.length}].`, 'info');
    items.push(num);
    updateUI();
    addLog('queueLog', `Step 3: Inserted ${num} at rear. Enqueue complete.`, 'success');
    showToast(`Enqueued ${num} at rear.`, 'success');
  }

  function dequeue() {
    if (items.length === 0) {
      showToast('Queue Underflow! Queue is already empty.', 'error');
      addLog('queueLog', 'Queue Underflow: Cannot dequeue from an empty queue.', 'error');
      return;
    }

    const dequeuedVal = items[0];
    addLog('queueLog', `Step 1: Read element at front index [0] -> ${dequeuedVal}.`, 'info');

    const firstSlot = document.querySelector('#queueTrack .queue-slot[data-index="0"]');
    const firstEl = firstSlot ? firstSlot.querySelector('.queue-element') : null;

    if (firstEl) {
      firstEl.classList.add('dequeuing');
      setTimeout(() => {
        items.shift();
        addLog('queueLog', 'Step 2: Removed front element. Shifted subsequent elements forward by 1.', 'info');
        addLog('queueLog', `Step 3: Dequeued ${dequeuedVal} successfully.`, 'success');
        updateUI();
        showToast(`Dequeued ${dequeuedVal} from front.`, 'info');
      }, 300);
    } else {
      items.shift();
      updateUI();
    }
  }

  function peekFront() {
    if (items.length === 0) {
      showToast('Queue is empty! No front element.', 'warning');
      addLog('queueLog', 'Peek Front called on empty queue.', 'warning');
      return;
    }
    const val = items[0];
    addLog('queueLog', `Peek Front: Inspecting front element -> ${val} at index [0].`, 'info');
    const slot = document.querySelector('#queueTrack .queue-slot[data-index="0"]');
    const el = slot ? slot.querySelector('.queue-element') : null;
    if (el) {
      el.classList.remove('peeking');
      void el.offsetWidth;
      el.classList.add('peeking');
    }
    showToast(`Front element: ${val} (Index [0])`, 'info');
  }

  function peekRear() {
    if (items.length === 0) {
      showToast('Queue is empty! No rear element.', 'warning');
      addLog('queueLog', 'Peek Rear called on empty queue.', 'warning');
      return;
    }
    const rearIdx = items.length - 1;
    const val = items[rearIdx];
    addLog('queueLog', `Peek Rear: Inspecting rear element -> ${val} at index [${rearIdx}].`, 'info');
    const slot = document.querySelector(`#queueTrack .queue-slot[data-index="${rearIdx}"]`);
    const el = slot ? slot.querySelector('.queue-element') : null;
    if (el) {
      el.classList.remove('peeking');
      void el.offsetWidth;
      el.classList.add('peeking');
    }
    showToast(`Rear element: ${val} (Index [${rearIdx}])`, 'info');
  }

  function reset() {
    items = [];
    updateUI();
    addLog('queueLog', 'Queue reset. Front = -1, Rear = -1, Size = 0.', 'system');
    showToast('Queue reset successfully.', 'info');
  }

  function randomEnqueue() {
    const rand = Math.floor(Math.random() * 90) + 10;
    enqueue(rand);
  }

  return { initSlots, enqueue, dequeue, peekFront, peekRear, reset, randomEnqueue };
})();


// =============================================================================
// MODULE 3: LINKED LIST IMPLEMENTATION & VISUALIZATION (SINGLY)
// =============================================================================

class LLNode {
  constructor(val) {
    this.data = val;
    this.next = null;
  }
}

const LinkedListVisualizer = (function() {
  let head = null;
  let count = 0;

  function renderList() {
    const container = document.getElementById('linkedlistContainer');
    const sizeBadge = document.getElementById('listSizeBadge');
    const headBadge = document.getElementById('listHeadBadge');

    sizeBadge.textContent = `Nodes: ${count}`;
    if (!head) {
      headBadge.textContent = 'Head: NULL';
      container.innerHTML = '<div class="empty-placeholder">List is currently empty. Head &rarr; NULL</div>';
      return;
    }

    headBadge.textContent = `Head: [${head.data}]`;
    container.innerHTML = '';

    let current = head;
    let index = 0;

    while (current !== null) {
      const nodeCard = document.createElement('div');
      nodeCard.className = 'll-node-card';
      nodeCard.setAttribute('data-index', index);
      nodeCard.setAttribute('data-value', current.data);

      let headBadgeHtml = (index === 0) ? '<span class="ll-head-badge">HEAD</span>' : '';
      let indexBadgeHtml = `<span class="ll-index-badge">Index ${index}</span>`;

      nodeCard.innerHTML = `
        ${headBadgeHtml}
        <div class="ll-node-box">
          <div class="ll-node-data">${current.data}</div>
          <div class="ll-node-next">next</div>
        </div>
        <div class="ll-arrow">&rarr;</div>
        ${indexBadgeHtml}
      `;
      container.appendChild(nodeCard);

      current = current.next;
      index++;
    }

    // NULL terminator
    const nullNode = document.createElement('div');
    nullNode.className = 'll-null-node';
    nullNode.textContent = 'NULL';
    container.appendChild(nullNode);
  }

  function insertHead(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') {
      showToast('Please enter a valid integer for node data.', 'warning');
      return;
    }
    const num = parseInt(val, 10);

    addLog('listLog', `Step 1: Allocate new node with data = ${num}.`, 'info');
    const newNode = new LLNode(num);
    newNode.next = head;
    addLog('listLog', `Step 2: Point newNode->next to current head (${head ? head.data : 'NULL'}).`, 'info');
    head = newNode;
    count++;
    addLog('listLog', `Step 3: Update head pointer to point to newNode. Insert at Head complete.`, 'success');

    renderList();
    showToast(`Inserted ${num} at Head.`, 'success');
  }

  function insertTail(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') {
      showToast('Please enter a valid integer for node data.', 'warning');
      return;
    }
    const num = parseInt(val, 10);
    const newNode = new LLNode(num);

    if (!head) {
      addLog('listLog', `List is empty. Setting head pointer to newNode (${num}).`, 'info');
      head = newNode;
      count++;
      renderList();
      showToast(`Inserted ${num} as initial Head.`, 'success');
      return;
    }

    addLog('listLog', `Step 1: Traverse from head to locate last node whose next == NULL.`, 'info');
    let curr = head;
    let step = 0;
    while (curr.next !== null) {
      curr = curr.next;
      step++;
    }
    addLog('listLog', `Step 2: Last node found (${curr.data}) after ${step} traversals.`, 'info');
    curr.next = newNode;
    count++;
    addLog('listLog', `Step 3: Linked lastNode->next = newNode (${num}). Insert at Tail complete.`, 'success');

    renderList();
    showToast(`Inserted ${num} at Tail.`, 'success');
  }

  function deleteValue(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') {
      showToast('Please enter a value to delete.', 'warning');
      return;
    }
    if (!head) {
      showToast('List is empty. Cannot delete.', 'error');
      addLog('listLog', 'Delete called on empty list (head == NULL).', 'error');
      return;
    }

    const num = parseInt(val, 10);
    addLog('listLog', `Step 1: Search for node with value ${num}.`, 'info');

    // Case 1: Head node has value
    if (head.data === num) {
      addLog('listLog', `Target found at head (${head.data}). Rewiring head = head->next.`, 'info');
      const firstCard = document.querySelector('.ll-node-card[data-index="0"] .ll-node-box');
      if (firstCard) firstCard.classList.add('highlight-deleting');

      setTimeout(() => {
        head = head.next;
        count--;
        renderList();
        addLog('listLog', `Deleted head node (${num}). Memory freed.`, 'success');
        showToast(`Deleted ${num} from head of list.`, 'success');
      }, 350);
      return;
    }

    // Case 2: Value is downstream
    let prev = head;
    let curr = head.next;
    let foundIndex = 1;

    while (curr !== null && curr.data !== num) {
      prev = curr;
      curr = curr.next;
      foundIndex++;
    }

    if (!curr) {
      addLog('listLog', `Value ${num} was not found in the linked list.`, 'warning');
      showToast(`Value ${num} not found in the list.`, 'warning');
      return;
    }

    addLog('listLog', `Step 2: Found ${num} at index ${foundIndex}. Rewiring prev->next = curr->next.`, 'info');
    const targetCard = document.querySelector(`.ll-node-card[data-index="${foundIndex}"] .ll-node-box`);
    if (targetCard) targetCard.classList.add('highlight-deleting');

    setTimeout(() => {
      prev.next = curr.next;
      count--;
      renderList();
      addLog('listLog', `Deleted node with value ${num}. Pointers updated.`, 'success');
      showToast(`Deleted node ${num} successfully.`, 'success');
    }, 350);
  }

  function searchValue(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') {
      showToast('Please enter a value to search.', 'warning');
      return;
    }
    if (!head) {
      showToast('List is empty. Value not found.', 'warning');
      return;
    }

    const num = parseInt(val, 10);
    addLog('listLog', `Starting linear search for value ${num} from Head.`, 'info');

    const nodeCards = document.querySelectorAll('.ll-node-card');
    let idx = 0;
    let found = false;

    function stepSearch() {
      if (idx > 0 && idx <= nodeCards.length) {
        const prevBox = nodeCards[idx - 1].querySelector('.ll-node-box');
        if (prevBox && !prevBox.classList.contains('highlight-found')) {
          prevBox.classList.remove('highlight-searching');
        }
      }

      if (idx >= nodeCards.length) {
        if (!found) {
          addLog('listLog', `Search finished: Value ${num} does not exist in the list.`, 'warning');
          showToast(`Value ${num} not found in linked list.`, 'warning');
        }
        return;
      }

      const card = nodeCards[idx];
      const box = card.querySelector('.ll-node-box');
      const cardVal = parseInt(card.getAttribute('data-value'), 10);

      box.classList.add('highlight-searching');
      addLog('listLog', `Traversing index [${idx}]: Value = ${cardVal}... comparing with target ${num}.`, 'info');

      if (cardVal === num) {
        found = true;
        box.classList.remove('highlight-searching');
        box.classList.add('highlight-found');
        addLog('listLog', `Target MATCH FOUND! Value ${num} is at index [${idx}].`, 'success');
        showToast(`Found ${num} at Index [${idx}]!`, 'success');
        return;
      }

      idx++;
      setTimeout(stepSearch, 400);
    }

    stepSearch();
  }

  function loadSample() {
    reset();
    const samples = [15, 28, 42, 65];
    for (const val of samples) {
      const newNode = new LLNode(val);
      if (!head) {
        head = newNode;
      } else {
        let curr = head;
        while (curr.next !== null) curr = curr.next;
        curr.next = newNode;
      }
      count++;
    }
    renderList();
    addLog('listLog', 'Loaded sample list: [15] -> [28] -> [42] -> [65] -> NULL.', 'system');
    showToast('Loaded sample Linked List.', 'info');
  }

  function reset() {
    head = null;
    count = 0;
    renderList();
    addLog('listLog', 'Linked List reset. All nodes cleared and memory deallocated.', 'system');
    showToast('Linked List cleared.', 'info');
  }

  return { insertHead, insertTail, deleteValue, searchValue, loadSample, reset };
})();


// =============================================================================
// MODULE 4: BINARY SEARCH TREE IMPLEMENTATION & VISUALIZATION (BST)
// =============================================================================

class BSTNode {
  constructor(val) {
    this.data = val;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

const BSTVisualizer = (function() {
  let root = null;
  let count = 0;

  // Insert node with duplicate detection and path tracking
  function insertNode(num) {
    if (num === null || num === undefined || isNaN(num) || num === '') {
      showToast('Please enter a valid integer key for BST.', 'warning');
      return;
    }
    const val = parseInt(num, 10);

    if (!root) {
      root = new BSTNode(val);
      count++;
      addLog('bstLog', `Tree was empty. Inserted ${val} as ROOT node.`, 'success');
      renderTree();
      showToast(`Inserted ${val} as Root.`, 'success');
      return;
    }

    let curr = root;
    const path = [];

    while (curr) {
      path.push(curr);
      if (val === curr.data) {
        showToast(`Duplicate Rejected! Key ${val} already exists in BST.`, 'warning');
        addLog('bstLog', `Duplicate Key: ${val} cannot be inserted. Standard BST enforces unique keys.`, 'warning');
        return;
      }

      if (val < curr.data) {
        addLog('bstLog', `Compare: ${val} < ${curr.data} -> Moving to LEFT subtree.`, 'info');
        if (!curr.left) {
          curr.left = new BSTNode(val);
          count++;
          addLog('bstLog', `Inserted ${val} as left child of ${curr.data}.`, 'success');
          break;
        }
        curr = curr.left;
      } else {
        addLog('bstLog', `Compare: ${val} > ${curr.data} -> Moving to RIGHT subtree.`, 'info');
        if (!curr.right) {
          curr.right = new BSTNode(val);
          count++;
          addLog('bstLog', `Inserted ${val} as right child of ${curr.data}.`, 'success');
          break;
        }
        curr = curr.right;
      }
    }

    renderTree();
    showToast(`Inserted ${val} into BST.`, 'success');
  }

  // Search node with visual path highlighting
  function searchNode(num) {
    if (num === null || num === undefined || isNaN(num) || num === '') {
      showToast('Please enter an integer key to search.', 'warning');
      return;
    }
    if (!root) {
      showToast('BST is empty. Key not found.', 'warning');
      return;
    }

    const target = parseInt(num, 10);
    addLog('bstLog', `Initiating BST Search for key ${target} starting at Root (${root.data}).`, 'info');

    // Collect search steps
    let curr = root;
    const searchSteps = [];
    let found = false;

    while (curr) {
      searchSteps.push(curr.data);
      if (curr.data === target) {
        found = true;
        break;
      }
      if (target < curr.data) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    // Step-by-step animation
    let stepIdx = 0;
    function animateStep() {
      if (stepIdx >= searchSteps.length) {
        if (!found) {
          addLog('bstLog', `Search finished: Key ${target} does not exist in BST.`, 'warning');
          showToast(`Key ${target} not found in BST.`, 'warning');
        }
        return;
      }

      const val = searchSteps[stepIdx];
      const isMatch = (val === target && found && stepIdx === searchSteps.length - 1);

      const nodeGroup = document.querySelector(`.bst-node-group[data-val="${val}"]`);
      if (nodeGroup) {
        if (isMatch) {
          nodeGroup.classList.remove('node-visited');
          nodeGroup.classList.add('node-found');
          addLog('bstLog', `Match Found! Key ${target} successfully located in BST.`, 'success');
          showToast(`Key ${target} found in BST!`, 'success');
        } else {
          nodeGroup.classList.add('node-visited');
          addLog('bstLog', `Inspected node [${val}]. Target ${target} is ${target < val ? 'smaller (go left)' : 'larger (go right)'}.`, 'info');
        }
      }

      stepIdx++;
      setTimeout(animateStep, 450);
    }

    // Clear previous search glows before starting
    document.querySelectorAll('.bst-node-group').forEach(el => {
      el.classList.remove('node-visited', 'node-found');
    });

    animateStep();
  }

  // Traversal Computations
  function getInorder(node, list = []) {
    if (!node) return list;
    getInorder(node.left, list);
    list.push(node.data);
    getInorder(node.right, list);
    return list;
  }

  function getPreorder(node, list = []) {
    if (!node) return list;
    list.push(node.data);
    getPreorder(node.left, list);
    getPreorder(node.right, list);
    return list;
  }

  function getPostorder(node, list = []) {
    if (!node) return list;
    getPostorder(node.left, list);
    getPostorder(node.right, list);
    list.push(node.data);
    return list;
  }

  // Visual Traversal Runner
  function runTraversal(type) {
    if (!root) {
      showToast('BST is empty. Nothing to traverse.', 'warning');
      return;
    }

    let sequence = [];
    let title = '';

    if (type === 'inorder') {
      sequence = getInorder(root);
      title = 'Inorder (Left → Root → Right) [Sorted Order]';
    } else if (type === 'preorder') {
      sequence = getPreorder(root);
      title = 'Preorder (Root → Left → Right)';
    } else if (type === 'postorder') {
      sequence = getPostorder(root);
      title = 'Postorder (Left → Right → Root)';
    }

    // Display Tray
    const tray = document.getElementById('traversalTray');
    const trayTitle = document.getElementById('traversalTitle');
    const typeBadge = document.getElementById('traversalTypeBadge');
    const chipsContainer = document.getElementById('traversalChips');

    tray.style.display = 'block';
    trayTitle.textContent = title;
    typeBadge.textContent = `${sequence.length} Nodes`;
    chipsContainer.innerHTML = '';

    addLog('bstLog', `Running ${title}: [${sequence.join(', ')}]`, 'info');

    // Reset node classes
    document.querySelectorAll('.bst-node-group').forEach(el => {
      el.classList.remove('node-visited', 'node-found');
    });

    // Step-by-step visit animation
    let i = 0;
    function animateVisit() {
      if (i >= sequence.length) {
        addLog('bstLog', `${type.toUpperCase()} traversal complete.`, 'success');
        showToast(`${type.toUpperCase()} traversal finished!`, 'success');
        return;
      }

      const val = sequence[i];
      const nodeGroup = document.querySelector(`.bst-node-group[data-val="${val}"]`);
      if (nodeGroup) {
        nodeGroup.classList.remove('node-visited');
        void nodeGroup.offsetWidth;
        nodeGroup.classList.add('node-visited');
      }

      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = val;
      chipsContainer.appendChild(chip);

      i++;
      setTimeout(animateVisit, 380);
    }

    animateVisit();
  }

  // Tree SVG Layout Coordinates Calculation
  function calculateLayout(node, depth = 0, leftBoundary = 50, rightBoundary = 850) {
    if (!node) return;

    node.x = (leftBoundary + rightBoundary) / 2;
    node.y = 50 + depth * 75;

    if (node.left) calculateLayout(node.left, depth + 1, leftBoundary, node.x);
    if (node.right) calculateLayout(node.right, depth + 1, node.x, rightBoundary);
  }

  // Render SVG
  function renderTree() {
    const svgEdges = document.getElementById('bstEdgesGroup');
    const svgNodes = document.getElementById('bstNodesGroup');
    const placeholder = document.getElementById('bstEmptyPlaceholder');
    const sizeBadge = document.getElementById('bstSizeBadge');
    const rootBadge = document.getElementById('bstRootBadge');

    sizeBadge.textContent = `Nodes: ${count}`;

    if (!root) {
      rootBadge.textContent = 'Root: NULL';
      svgEdges.innerHTML = '';
      svgNodes.innerHTML = '';
      placeholder.style.display = 'block';
      return;
    }

    placeholder.style.display = 'none';
    rootBadge.textContent = `Root: [${root.data}]`;
    svgEdges.innerHTML = '';
    svgNodes.innerHTML = '';

    // Calculate (x, y) coordinates
    calculateLayout(root, 0, 50, 850);

    // Render edges & nodes recursively
    function drawSubtree(node) {
      if (!node) return;

      // Draw branch to left child
      if (node.left) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.left.x);
        line.setAttribute('y2', node.left.y);
        line.setAttribute('class', 'bst-edge');
        line.setAttribute('data-parent', node.data);
        line.setAttribute('data-child', node.left.data);
        svgEdges.appendChild(line);
        drawSubtree(node.left);
      }

      // Draw branch to right child
      if (node.right) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.right.x);
        line.setAttribute('y2', node.right.y);
        line.setAttribute('class', 'bst-edge');
        line.setAttribute('data-parent', node.data);
        line.setAttribute('data-child', node.right.data);
        svgEdges.appendChild(line);
        drawSubtree(node.right);
      }

      // Draw node group (circle + text)
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'bst-node-group' + (node === root ? ' is-root' : ''));
      g.setAttribute('data-val', node.data);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', 20);
      circle.setAttribute('class', 'bst-node-circle');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y);
      text.setAttribute('class', 'bst-node-text');
      text.textContent = node.data;

      g.appendChild(circle);
      g.appendChild(text);
      svgNodes.appendChild(g);
    }

    drawSubtree(root);
  }

  function loadSample() {
    reset();
    const sampleKeys = [50, 30, 70, 20, 40, 60, 80];
    sampleKeys.forEach(k => {
      if (!root) {
        root = new BSTNode(k);
        count++;
      } else {
        let curr = root;
        while (curr) {
          if (k < curr.data) {
            if (!curr.left) { curr.left = new BSTNode(k); count++; break; }
            curr = curr.left;
          } else {
            if (!curr.right) { curr.right = new BSTNode(k); count++; break; }
            curr = curr.right;
          }
        }
      }
    });

    renderTree();
    addLog('bstLog', 'Loaded balanced sample tree: [50, 30, 70, 20, 40, 60, 80].', 'system');
    showToast('Loaded balanced BST sample.', 'info');
  }

  function reset() {
    root = null;
    count = 0;
    renderTree();
    const tray = document.getElementById('traversalTray');
    if (tray) tray.style.display = 'none';
    addLog('bstLog', 'BST reset. All nodes deallocated from memory.', 'system');
    showToast('BST cleared.', 'info');
  }

  return { insertNode, searchNode, runTraversal, loadSample, reset };
})();


// =============================================================================
// C++ ACADEMIC SOURCE CODE EMBEDDED VIEWER
// =============================================================================

const cppCodeFiles = {
  stack_h: `// File: cpp/stack.h
#ifndef STACK_H
#define STACK_H

#include <iostream>

// Array-based Stack implementation (LIFO - Last In First Out)
class Stack {
private:
    static const int MAX_CAPACITY = 8; // Fixed size for academic demonstration
    int arr[MAX_CAPACITY];
    int topIndex;

public:
    // Constructor initializes an empty stack
    Stack();

    // Core operations
    bool push(int value);
    int pop();
    int peek() const;

    // Helper state queries
    bool isEmpty() const;
    bool isFull() const;
    int size() const;
    int getCapacity() const;
    void display() const;
    void clear();
};

#endif // STACK_H`,

  stack_cpp: `// File: cpp/stack.cpp
#include "stack.h"

// Constructor: Initializes topIndex to -1 (indicating empty stack)
Stack::Stack() {
    topIndex = -1;
}

// Push: Adds an element onto the top of the stack
// Time Complexity: O(1)
bool Stack::push(int value) {
    if (isFull()) {
        std::cout << "[Error] Stack Overflow: Cannot push " << value 
                  << ". Stack is at maximum capacity (" << MAX_CAPACITY << ").\\n";
        return false;
    }
    arr[++topIndex] = value;
    std::cout << "[Success] Pushed " << value << " onto the stack at index " << topIndex << ".\\n";
    return true;
}

// Pop: Removes and returns the top element
// Time Complexity: O(1)
int Stack::pop() {
    if (isEmpty()) {
        std::cout << "[Error] Stack Underflow: Cannot pop from an empty stack.\\n";
        return -1;
    }
    int poppedValue = arr[topIndex--];
    std::cout << "[Success] Popped " << poppedValue << " from the stack.\\n";
    return poppedValue;
}

// Peek: Returns the value of the top element without removing it
// Time Complexity: O(1)
int Stack::peek() const {
    if (isEmpty()) {
        std::cout << "[Warning] Stack is empty. No top element to peek.\\n";
        return -1;
    }
    return arr[topIndex];
}

// Checks if the stack has zero elements
bool Stack::isEmpty() const {
    return topIndex == -1;
}

// Checks if the stack has reached maximum capacity
bool Stack::isFull() const {
    return topIndex == MAX_CAPACITY - 1;
}

// Returns the current count of elements in the stack
int Stack::size() const {
    return topIndex + 1;
}

// Returns the maximum capacity of the stack
int Stack::getCapacity() const {
    return MAX_CAPACITY;
}

// Displays all elements currently stored in the stack from top to bottom
void Stack::display() const {
    if (isEmpty()) {
        std::cout << "[Stack] Status: Empty []\\n";
        return;
    }
    std::cout << "[Stack] Top -> ";
    for (int i = topIndex; i >= 0; --i) {
        std::cout << "[" << arr[i] << "] ";
    }
    std::cout << "<- Bottom (Size: " << size() << "/" << MAX_CAPACITY << ")\\n";
}

// Clears all elements from the stack
void Stack::clear() {
    topIndex = -1;
    std::cout << "[Stack] Cleared all elements.\\n";
}`,

  queue_h: `// File: cpp/queue.h
#ifndef QUEUE_H
#define QUEUE_H

#include <iostream>

// Array-based Queue implementation (FIFO - First In First Out)
// Uses a circular buffer representation to maximize storage efficiency
class Queue {
private:
    static const int MAX_CAPACITY = 8; // Fixed size for academic demonstration
    int arr[MAX_CAPACITY];
    int frontIndex;
    int rearIndex;
    int count;

public:
    // Constructor initializes an empty queue
    Queue();

    // Core operations
    bool enqueue(int value);
    int dequeue();
    int getFront() const;
    int getRear() const;

    // Helper state queries
    bool isEmpty() const;
    bool isFull() const;
    int size() const;
    int getCapacity() const;
    void display() const;
    void clear();
};

#endif // QUEUE_H`,

  queue_cpp: `// File: cpp/queue.cpp
#include "queue.h"

// Constructor: Initializes empty queue indices
Queue::Queue() {
    frontIndex = 0;
    rearIndex = -1;
    count = 0;
}

// Enqueue: Inserts an element at the rear of the queue
// Time Complexity: O(1)
bool Queue::enqueue(int value) {
    if (isFull()) {
        std::cout << "[Error] Queue Overflow: Cannot enqueue " << value 
                  << ". Queue is at maximum capacity (" << MAX_CAPACITY << ").\\n";
        return false;
    }
    rearIndex = (rearIndex + 1) % MAX_CAPACITY;
    arr[rearIndex] = value;
    count++;
    std::cout << "[Success] Enqueued " << value << " at rear (index " << rearIndex << ").\\n";
    return true;
}

// Dequeue: Removes and returns the element at the front of the queue
// Time Complexity: O(1)
int Queue::dequeue() {
    if (isEmpty()) {
        std::cout << "[Error] Queue Underflow: Cannot dequeue from an empty queue.\\n";
        return -1;
    }
    int dequeuedValue = arr[frontIndex];
    frontIndex = (frontIndex + 1) % MAX_CAPACITY;
    count--;
    std::cout << "[Success] Dequeued " << dequeuedValue << " from front.\\n";
    return dequeuedValue;
}

// getFront: Retrieves the value at the front without removing it
// Time Complexity: O(1)
int Queue::getFront() const {
    if (isEmpty()) {
        std::cout << "[Warning] Queue is empty. No front element.\\n";
        return -1;
    }
    return arr[frontIndex];
}

// getRear: Retrieves the value at the rear without removing it
// Time Complexity: O(1)
int Queue::getRear() const {
    if (isEmpty()) {
        std::cout << "[Warning] Queue is empty. No rear element.\\n";
        return -1;
    }
    return arr[rearIndex];
}

// Checks if the queue contains no elements
bool Queue::isEmpty() const {
    return count == 0;
}

// Checks if the queue has reached capacity
bool Queue::isFull() const {
    return count == MAX_CAPACITY;
}

// Returns the number of elements currently in the queue
int Queue::size() const {
    return count;
}

// Returns the capacity of the queue
int Queue::getCapacity() const {
    return MAX_CAPACITY;
}

// Displays all elements from front to rear
void Queue::display() const {
    if (isEmpty()) {
        std::cout << "[Queue] Status: Empty []\\n";
        return;
    }
    std::cout << "[Queue] Front -> ";
    for (int i = 0; i < count; ++i) {
        int idx = (frontIndex + i) % MAX_CAPACITY;
        std::cout << "[" << arr[idx] << "] ";
    }
    std::cout << "<- Rear (Size: " << count << "/" << MAX_CAPACITY << ")\\n";
}

// Clears the queue
void Queue::clear() {
    frontIndex = 0;
    rearIndex = -1;
    count = 0;
    std::cout << "[Queue] Cleared all elements.\\n";
}`,

  list_h: `// File: cpp/linkedlist.h
#ifndef LINKEDLIST_H
#define LINKEDLIST_H

#include <iostream>

// Node structure for Singly Linked List
struct Node {
    int data;
    Node* next;

    Node(int val) : data(val), next(nullptr) {}
};

// Singly Linked List class
class LinkedList {
private:
    Node* head;
    int count;

public:
    // Constructor initializes an empty list
    LinkedList();

    // Destructor to deallocate dynamically allocated memory
    ~LinkedList();

    // Core operations
    void insertAtBeginning(int value);
    void insertAtEnd(int value);
    bool deleteNode(int value);
    int search(int value) const; // Returns 0-based position, or -1 if not found

    // Helper state queries
    bool isEmpty() const;
    int size() const;
    void display() const;
    void clear();
};

#endif // LINKEDLIST_H`,

  list_cpp: `// File: cpp/linkedlist.cpp
#include "linkedlist.h"

// Constructor
LinkedList::LinkedList() : head(nullptr), count(0) {}

// Destructor
LinkedList::~LinkedList() {
    clear();
}

// Insert at the beginning (Head)
// Time Complexity: O(1)
void LinkedList::insertAtBeginning(int value) {
    Node* newNode = new Node(value);
    newNode->next = head;
    head = newNode;
    count++;
    std::cout << "[Success] Inserted " << value << " at the beginning (new head).\\n";
}

// Insert at the end (Tail)
// Time Complexity: O(n)
void LinkedList::insertAtEnd(int value) {
    Node* newNode = new Node(value);
    if (head == nullptr) {
        head = newNode;
        count++;
        std::cout << "[Success] List was empty. Inserted " << value << " as head.\\n";
        return;
    }

    Node* current = head;
    while (current->next != nullptr) {
        current = current->next;
    }
    current->next = newNode;
    count++;
    std::cout << "[Success] Inserted " << value << " at the end of the list.\\n";
}

// Delete a node by value
// Time Complexity: O(n)
bool LinkedList::deleteNode(int value) {
    if (isEmpty()) {
        std::cout << "[Error] Cannot delete from empty list.\\n";
        return false;
    }

    // Case 1: Node to delete is the head
    if (head->data == value) {
        Node* temp = head;
        head = head->next;
        delete temp;
        count--;
        std::cout << "[Success] Deleted " << value << " from head of the list.\\n";
        return true;
    }

    // Case 2: Node is further down in the list
    Node* current = head;
    while (current->next != nullptr && current->next->data != value) {
        current = current->next;
    }

    if (current->next == nullptr) {
        std::cout << "[Warning] Value " << value << " not found in the list.\\n";
        return false;
    }

    Node* target = current->next;
    current->next = target->next;
    delete target;
    count--;
    std::cout << "[Success] Deleted " << value << " from the list.\\n";
    return true;
}

// Search for a value in the list
// Time Complexity: O(n)
int LinkedList::search(int value) const {
    Node* current = head;
    int index = 0;
    while (current != nullptr) {
        if (current->data == value) {
            std::cout << "[Found] Value " << value << " found at index " << index << ".\\n";
            return index;
        }
        current = current->next;
        index++;
    }
    std::cout << "[Not Found] Value " << value << " does not exist in the list.\\n";
    return -1;
}

// Checks if the list is empty
bool LinkedList::isEmpty() const {
    return head == nullptr;
}

// Returns the number of nodes
int LinkedList::size() const {
    return count;
}

// Displays nodes connected with arrows
void LinkedList::display() const {
    if (isEmpty()) {
        std::cout << "[LinkedList] Head -> NULL (Empty)\\n";
        return;
    }
    std::cout << "[LinkedList] Head -> ";
    Node* current = head;
    while (current != nullptr) {
        std::cout << "[" << current->data << " | *] -> ";
        current = current->next;
    }
    std::cout << "NULL (Length: " << count << ")\\n";
}

// Clears all nodes to prevent memory leak
void LinkedList::clear() {
    Node* current = head;
    while (current != nullptr) {
        Node* nextNode = current->next;
        delete current;
        current = nextNode;
    }
    head = nullptr;
    count = 0;
    std::cout << "[LinkedList] All nodes cleared and memory freed.\\n";
}`,

  bst_h: `// File: cpp/bst.h
#ifndef BST_H
#define BST_H

#include <iostream>
#include <vector>

// Node structure for Binary Search Tree
struct BSTNode {
    int data;
    BSTNode* left;
    BSTNode* right;

    BSTNode(int val) : data(val), left(nullptr), right(nullptr) {}
};

// Binary Search Tree class
class BinarySearchTree {
private:
    BSTNode* root;
    int count;

    // Recursive helper functions
    BSTNode* insertHelper(BSTNode* node, int value, bool& isInserted);
    bool searchHelper(BSTNode* node, int value) const;
    void inorderHelper(BSTNode* node, std::vector<int>& result) const;
    void preorderHelper(BSTNode* node, std::vector<int>& result) const;
    void postorderHelper(BSTNode* node, std::vector<int>& result) const;
    void clearHelper(BSTNode* node);

public:
    // Constructor initializes an empty BST
    BinarySearchTree();

    // Destructor ensures all dynamically allocated nodes are freed
    ~BinarySearchTree();

    // Core operations
    bool insert(int value);
    bool search(int value) const;

    // Tree traversals
    std::vector<int> inorder() const;
    std::vector<int> preorder() const;
    std::vector<int> postorder() const;

    // Helper state queries
    bool isEmpty() const;
    int size() const;
    void clear();
    void displayTraversals() const;
};

#endif // BST_H`,

  bst_cpp: `// File: cpp/bst.cpp
#include "bst.h"

// Constructor
BinarySearchTree::BinarySearchTree() : root(nullptr), count(0) {}

// Destructor
BinarySearchTree::~BinarySearchTree() {
    clear();
}

// Recursive helper for insertion
BSTNode* BinarySearchTree::insertHelper(BSTNode* node, int value, bool& isInserted) {
    if (node == nullptr) {
        isInserted = true;
        count++;
        return new BSTNode(value);
    }

    if (value < node->data) {
        node->left = insertHelper(node->left, value, isInserted);
    } else if (value > node->data) {
        node->right = insertHelper(node->right, value, isInserted);
    } else {
        // Value already exists (duplicate)
        isInserted = false;
        std::cout << "[Warning] Duplicate value " << value << " cannot be inserted into BST.\\n";
    }
    return node;
}

// Insert a node into BST
// Time Complexity: O(log n) average, O(n) worst case
bool BinarySearchTree::insert(int value) {
    bool isInserted = false;
    root = insertHelper(root, value, isInserted);
    if (isInserted) {
        std::cout << "[Success] Inserted " << value << " into BST. (Current count: " << count << ")\\n";
    }
    return isInserted;
}

// Recursive helper for search
bool BinarySearchTree::searchHelper(BSTNode* node, int value) const {
    if (node == nullptr) return false;
    if (node->data == value) return true;
    if (value < node->data) return searchHelper(node->left, value);
    else return searchHelper(node->right, value);
}

// Search for a value in BST
// Time Complexity: O(log n) average, O(n) worst case
bool BinarySearchTree::search(int value) const {
    bool found = searchHelper(root, value);
    if (found) {
        std::cout << "[Found] Value " << value << " exists in the BST.\\n";
    } else {
        std::cout << "[Not Found] Value " << value << " does not exist in the BST.\\n";
    }
    return found;
}

// Inorder traversal: Left -> Root -> Right (Produces sorted order)
void BinarySearchTree::inorderHelper(BSTNode* node, std::vector<int>& result) const {
    if (node != nullptr) {
        inorderHelper(node->left, result);
        result.push_back(node->data);
        inorderHelper(node->right, result);
    }
}

std::vector<int> BinarySearchTree::inorder() const {
    std::vector<int> result;
    inorderHelper(root, result);
    return result;
}

// Preorder traversal: Root -> Left -> Right
void BinarySearchTree::preorderHelper(BSTNode* node, std::vector<int>& result) const {
    if (node != nullptr) {
        result.push_back(node->data);
        preorderHelper(node->left, result);
        preorderHelper(node->right, result);
    }
}

std::vector<int> BinarySearchTree::preorder() const {
    std::vector<int> result;
    preorderHelper(root, result);
    return result;
}

// Postorder traversal: Left -> Right -> Root
void BinarySearchTree::postorderHelper(BSTNode* node, std::vector<int>& result) const {
    if (node != nullptr) {
        postorderHelper(node->left, result);
        postorderHelper(node->right, result);
        result.push_back(node->data);
    }
}

std::vector<int> BinarySearchTree::postorder() const {
    std::vector<int> result;
    postorderHelper(root, result);
    return result;
}

// Recursive helper to deallocate nodes
void BinarySearchTree::clearHelper(BSTNode* node) {
    if (node != nullptr) {
        clearHelper(node->left);
        clearHelper(node->right);
        delete node;
    }
}

// Clears the entire tree and frees memory
void BinarySearchTree::clear() {
    clearHelper(root);
    root = nullptr;
    count = 0;
    std::cout << "[BST] Tree cleared and memory freed.\\n";
}

bool BinarySearchTree::isEmpty() const {
    return root == nullptr;
}

int BinarySearchTree::size() const {
    return count;
}

void BinarySearchTree::displayTraversals() const {
    if (isEmpty()) {
        std::cout << "[BST] Tree is currently empty.\\n";
        return;
    }
    std::cout << "\\n--- BST Traversals (Size: " << count << ") ---\\n";
    std::vector<int> in = inorder();
    std::cout << "Inorder   (L-Root-R) [Sorted]: ";
    for (int v : in) std::cout << v << " ";
    std::cout << "\\n";

    std::vector<int> pre = preorder();
    std::cout << "Preorder  (Root-L-R)         : ";
    for (int v : pre) std::cout << v << " ";
    std::cout << "\\n";

    std::vector<int> post = postorder();
    std::cout << "Postorder (L-R-Root)         : ";
    for (int v : post) std::cout << v << " ";
    std::cout << "\\n-------------------------------\\n";
}`,

  main_cpp: `// File: cpp/main.cpp
#include <iostream>
#include "stack.h"
#include "queue.h"
#include "linkedlist.h"
#include "bst.h"

// Comprehensive test and demonstration runner for C++ DSA implementations
int main() {
    std::cout << "=====================================================\\n";
    std::cout << "  DSA Visualizer - C++ Academic Demonstration Suite  \\n";
    std::cout << "=====================================================\\n\\n";

    // 1. Stack Demonstration
    std::cout << "=== [1. STACK DEMONSTRATION] ===\\n";
    Stack stack;
    stack.push(10);
    stack.push(20);
    stack.push(30);
    stack.display();
    std::cout << "Peek top element: " << stack.peek() << "\\n";
    stack.pop();
    stack.display();
    std::cout << "\\n";

    // 2. Queue Demonstration
    std::cout << "=== [2. QUEUE DEMONSTRATION] ===\\n";
    Queue queue;
    queue.enqueue(100);
    queue.enqueue(200);
    queue.enqueue(300);
    queue.display();
    std::cout << "Front element: " << queue.getFront() << "\\n";
    std::cout << "Rear element: " << queue.getRear() << "\\n";
    queue.dequeue();
    queue.display();
    std::cout << "\\n";

    // 3. Linked List Demonstration
    std::cout << "=== [3. LINKED LIST DEMONSTRATION] ===\\n";
    LinkedList list;
    list.insertAtBeginning(15);
    list.insertAtBeginning(5);
    list.insertAtEnd(25);
    list.insertAtEnd(35);
    list.display();
    list.search(25);
    list.deleteNode(15);
    list.display();
    std::cout << "\\n";

    // 4. Binary Search Tree Demonstration
    std::cout << "=== [4. BINARY SEARCH TREE DEMONSTRATION] ===\\n";
    BinarySearchTree bst;
    bst.insert(50);
    bst.insert(30);
    bst.insert(70);
    bst.insert(20);
    bst.insert(40);
    bst.insert(60);
    bst.insert(80);
    bst.displayTraversals();
    bst.search(40);
    bst.search(99);
    std::cout << "\\n";

    std::cout << "=====================================================\\n";
    std::cout << "  All C++ Data Structure Demonstrations Finished OK!  \\n";
    std::cout << "=====================================================\\n";

    return 0;
}`
};

function initCodeViewer() {
  const codeArea = document.getElementById('codeDisplayArea');
  const filenameEl = document.getElementById('currentCodeFileName');
  const copyBtn = document.getElementById('btnCopyCode');
  const tabButtons = document.querySelectorAll('.code-tab-btn');

  function loadCode(key) {
    if (!cppCodeFiles[key]) return;
    codeArea.textContent = cppCodeFiles[key];
    const cleanName = key.replace('_', '.');
    filenameEl.textContent = `cpp/${cleanName}`;
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-code') === key));
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadCode(btn.getAttribute('data-code'));
    });
  });

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(codeArea.textContent).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied to Clipboard!';
      showToast('C++ source code copied to clipboard!', 'success');
      setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
    }).catch(() => {
      showToast('Could not copy code automatically.', 'warning');
    });
  });

  // Default initial file
  loadCode('stack_h');
}


// =============================================================================
// DOM EVENT LISTENERS INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navigation items
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.getAttribute('data-target'));
    });
  });

  // 2. Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // 3. Initialize Queue Track Slots
  QueueVisualizer.initSlots();

  // 4. Initialize Code Viewer
  initCodeViewer();

  // 5. Connect Stack Controls
  const stackInput = document.getElementById('stackInput');
  document.getElementById('btnStackPush').addEventListener('click', () => {
    StackVisualizer.push(stackInput.value);
    stackInput.value = '';
    stackInput.focus();
  });
  document.getElementById('btnStackPop').addEventListener('click', StackVisualizer.pop);
  document.getElementById('btnStackPeek').addEventListener('click', StackVisualizer.peek);
  document.getElementById('btnStackRandom').addEventListener('click', StackVisualizer.randomPush);
  document.getElementById('btnStackReset').addEventListener('click', StackVisualizer.reset);
  setupLogClear('clearStackLog', 'stackLog', 'Stack log cleared. Ready.');

  stackInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      StackVisualizer.push(stackInput.value);
      stackInput.value = '';
    }
  });

  // 6. Connect Queue Controls
  const queueInput = document.getElementById('queueInput');
  document.getElementById('btnQueueEnqueue').addEventListener('click', () => {
    QueueVisualizer.enqueue(queueInput.value);
    queueInput.value = '';
    queueInput.focus();
  });
  document.getElementById('btnQueueDequeue').addEventListener('click', QueueVisualizer.dequeue);
  document.getElementById('btnQueueFront').addEventListener('click', QueueVisualizer.peekFront);
  document.getElementById('btnQueueRear').addEventListener('click', QueueVisualizer.peekRear);
  document.getElementById('btnQueueRandom').addEventListener('click', QueueVisualizer.randomEnqueue);
  document.getElementById('btnQueueReset').addEventListener('click', QueueVisualizer.reset);
  setupLogClear('clearQueueLog', 'queueLog', 'Queue log cleared. Ready.');

  queueInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      QueueVisualizer.enqueue(queueInput.value);
      queueInput.value = '';
    }
  });

  // 7. Connect Linked List Controls
  const listInput = document.getElementById('listInput');
  document.getElementById('btnListInsertHead').addEventListener('click', () => {
    LinkedListVisualizer.insertHead(listInput.value);
    listInput.value = '';
    listInput.focus();
  });
  document.getElementById('btnListInsertTail').addEventListener('click', () => {
    LinkedListVisualizer.insertTail(listInput.value);
    listInput.value = '';
    listInput.focus();
  });
  document.getElementById('btnListDelete').addEventListener('click', () => {
    LinkedListVisualizer.deleteValue(listInput.value);
    listInput.value = '';
    listInput.focus();
  });
  document.getElementById('btnListSearch').addEventListener('click', () => {
    LinkedListVisualizer.searchValue(listInput.value);
    listInput.focus();
  });
  document.getElementById('btnListSample').addEventListener('click', LinkedListVisualizer.loadSample);
  document.getElementById('btnListReset').addEventListener('click', LinkedListVisualizer.reset);
  setupLogClear('clearListLog', 'listLog', 'Linked List log cleared. Ready.');

  listInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      LinkedListVisualizer.insertTail(listInput.value);
      listInput.value = '';
    }
  });

  // 8. Connect BST Controls
  const bstInput = document.getElementById('bstInput');
  document.getElementById('btnBstInsert').addEventListener('click', () => {
    BSTVisualizer.insertNode(bstInput.value);
    bstInput.value = '';
    bstInput.focus();
  });
  document.getElementById('btnBstSearch').addEventListener('click', () => {
    BSTVisualizer.searchNode(bstInput.value);
    bstInput.focus();
  });
  document.getElementById('btnBstInorder').addEventListener('click', () => BSTVisualizer.runTraversal('inorder'));
  document.getElementById('btnBstPreorder').addEventListener('click', () => BSTVisualizer.runTraversal('preorder'));
  document.getElementById('btnBstPostorder').addEventListener('click', () => BSTVisualizer.runTraversal('postorder'));
  document.getElementById('btnBstSample').addEventListener('click', BSTVisualizer.loadSample);
  document.getElementById('btnBstReset').addEventListener('click', BSTVisualizer.reset);
  setupLogClear('clearBstLog', 'bstLog', 'Binary Search Tree log cleared. Ready.');

  bstInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      BSTVisualizer.insertNode(bstInput.value);
      bstInput.value = '';
    }
  });
});
