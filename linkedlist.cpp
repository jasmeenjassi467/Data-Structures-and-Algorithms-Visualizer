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
    std::cout << "[Success] Inserted " << value << " at the beginning (new head).\n";
}

// Insert at the end (Tail)
// Time Complexity: O(n)
void LinkedList::insertAtEnd(int value) {
    Node* newNode = new Node(value);
    if (head == nullptr) {
        head = newNode;
        count++;
        std::cout << "[Success] List was empty. Inserted " << value << " as head.\n";
        return;
    }

    Node* current = head;
    while (current->next != nullptr) {
        current = current->next;
    }
    current->next = newNode;
    count++;
    std::cout << "[Success] Inserted " << value << " at the end of the list.\n";
}

// Delete a node by value
// Time Complexity: O(n)
bool LinkedList::deleteNode(int value) {
    if (isEmpty()) {
        std::cout << "[Error] Cannot delete from empty list.\n";
        return false;
    }

    // Case 1: Node to delete is the head
    if (head->data == value) {
        Node* temp = head;
        head = head->next;
        delete temp;
        count--;
        std::cout << "[Success] Deleted " << value << " from head of the list.\n";
        return true;
    }

    // Case 2: Node is further down in the list
    Node* current = head;
    while (current->next != nullptr && current->next->data != value) {
        current = current->next;
    }

    if (current->next == nullptr) {
        std::cout << "[Warning] Value " << value << " not found in the list.\n";
        return false;
    }

    Node* target = current->next;
    current->next = target->next;
    delete target;
    count--;
    std::cout << "[Success] Deleted " << value << " from the list.\n";
    return true;
}

// Search for a value in the list
// Returns 0-based index or -1 if not found
// Time Complexity: O(n)
int LinkedList::search(int value) const {
    Node* current = head;
    int index = 0;
    while (current != nullptr) {
        if (current->data == value) {
            std::cout << "[Found] Value " << value << " found at index " << index << ".\n";
            return index;
        }
        current = current->next;
        index++;
    }
    std::cout << "[Not Found] Value " << value << " does not exist in the list.\n";
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
        std::cout << "[LinkedList] Head -> NULL (Empty)\n";
        return;
    }
    std::cout << "[LinkedList] Head -> ";
    Node* current = head;
    while (current != nullptr) {
        std::cout << "[" << current->data << " | *] -> ";
        current = current->next;
    }
    std::cout << "NULL (Length: " << count << ")\n";
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
    std::cout << "[LinkedList] All nodes cleared and memory freed.\n";
}
