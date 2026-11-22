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

#endif // BST_H
