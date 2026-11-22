#include <iostream>
#include "stack.h"
#include "queue.h"
#include "linkedlist.h"
#include "bst.h"

// Comprehensive test and demonstration runner for C++ DSA implementations
int main() {
    std::cout << "=====================================================\n";
    std::cout << "  DSA Visualizer - C++ Academic Demonstration Suite  \n";
    std::cout << "=====================================================\n\n";

    // 1. Stack Demonstration
    std::cout << "=== [1. STACK DEMONSTRATION] ===\n";
    Stack stack;
    stack.push(10);
    stack.push(20);
    stack.push(30);
    stack.display();
    std::cout << "Peek top element: " << stack.peek() << "\n";
    stack.pop();
    stack.display();
    std::cout << "\n";

    // 2. Queue Demonstration
    std::cout << "=== [2. QUEUE DEMONSTRATION] ===\n";
    Queue queue;
    queue.enqueue(100);
    queue.enqueue(200);
    queue.enqueue(300);
    queue.display();
    std::cout << "Front element: " << queue.getFront() << "\n";
    std::cout << "Rear element: " << queue.getRear() << "\n";
    queue.dequeue();
    queue.display();
    std::cout << "\n";

    // 3. Linked List Demonstration
    std::cout << "=== [3. LINKED LIST DEMONSTRATION] ===\n";
    LinkedList list;
    list.insertAtBeginning(15);
    list.insertAtBeginning(5);
    list.insertAtEnd(25);
    list.insertAtEnd(35);
    list.display();
    list.search(25);
    list.deleteNode(15);
    list.display();
    std::cout << "\n";

    // 4. Binary Search Tree Demonstration
    std::cout << "=== [4. BINARY SEARCH TREE DEMONSTRATION] ===\n";
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
    std::cout << "\n";

    std::cout << "=====================================================\n";
    std::cout << "  All C++ Data Structure Demonstrations Finished OK!  \n";
    std::cout << "=====================================================\n";

    return 0;
}
