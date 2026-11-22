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
                  << ". Stack is at maximum capacity (" << MAX_CAPACITY << ").\n";
        return false;
    }
    arr[++topIndex] = value;
    std::cout << "[Success] Pushed " << value << " onto the stack at index " << topIndex << ".\n";
    return true;
}

// Pop: Removes and returns the top element
// Time Complexity: O(1)
int Stack::pop() {
    if (isEmpty()) {
        std::cout << "[Error] Stack Underflow: Cannot pop from an empty stack.\n";
        return -1;
    }
    int poppedValue = arr[topIndex--];
    std::cout << "[Success] Popped " << poppedValue << " from the stack.\n";
    return poppedValue;
}

// Peek: Returns the value of the top element without removing it
// Time Complexity: O(1)
int Stack::peek() const {
    if (isEmpty()) {
        std::cout << "[Warning] Stack is empty. No top element to peek.\n";
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
        std::cout << "[Stack] Status: Empty []\n";
        return;
    }
    std::cout << "[Stack] Top -> ";
    for (int i = topIndex; i >= 0; --i) {
        std::cout << "[" << arr[i] << "] ";
    }
    std::cout << "<- Bottom (Size: " << size() << "/" << MAX_CAPACITY << ")\n";
}

// Clears all elements from the stack
void Stack::clear() {
    topIndex = -1;
    std::cout << "[Stack] Cleared all elements.\n";
}
