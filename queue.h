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

#endif // QUEUE_H
