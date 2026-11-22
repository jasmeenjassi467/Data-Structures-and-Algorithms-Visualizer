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
                  << ". Queue is at maximum capacity (" << MAX_CAPACITY << ").\n";
        return false;
    }
    rearIndex = (rearIndex + 1) % MAX_CAPACITY;
    arr[rearIndex] = value;
    count++;
    std::cout << "[Success] Enqueued " << value << " at rear (index " << rearIndex << ").\n";
    return true;
}

// Dequeue: Removes and returns the element at the front of the queue
// Time Complexity: O(1)
int Queue::dequeue() {
    if (isEmpty()) {
        std::cout << "[Error] Queue Underflow: Cannot dequeue from an empty queue.\n";
        return -1;
    }
    int dequeuedValue = arr[frontIndex];
    frontIndex = (frontIndex + 1) % MAX_CAPACITY;
    count--;
    std::cout << "[Success] Dequeued " << dequeuedValue << " from front.\n";
    return dequeuedValue;
}

// getFront: Retrieves the value at the front without removing it
// Time Complexity: O(1)
int Queue::getFront() const {
    if (isEmpty()) {
        std::cout << "[Warning] Queue is empty. No front element.\n";
        return -1;
    }
    return arr[frontIndex];
}

// getRear: Retrieves the value at the rear without removing it
// Time Complexity: O(1)
int Queue::getRear() const {
    if (isEmpty()) {
        std::cout << "[Warning] Queue is empty. No rear element.\n";
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
        std::cout << "[Queue] Status: Empty []\n";
        return;
    }
    std::cout << "[Queue] Front -> ";
    for (int i = 0; i < count; ++i) {
        int idx = (frontIndex + i) % MAX_CAPACITY;
        std::cout << "[" << arr[idx] << "] ";
    }
    std::cout << "<- Rear (Size: " << count << "/" << MAX_CAPACITY << ")\n";
}

// Clears the queue
void Queue::clear() {
    frontIndex = 0;
    rearIndex = -1;
    count = 0;
    std::cout << "[Queue] Cleared all elements.\n";
}
