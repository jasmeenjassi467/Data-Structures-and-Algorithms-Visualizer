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

#endif // LINKEDLIST_H
