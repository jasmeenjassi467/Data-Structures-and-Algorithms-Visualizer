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

#endif // STACK_H
