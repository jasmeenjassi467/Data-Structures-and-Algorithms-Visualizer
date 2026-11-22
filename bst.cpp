#include "bst.h"

// Constructor
BinarySearchTree::BinarySearchTree() : root(nullptr), count(0) {}

// Destructor
BinarySearchTree::~BinarySearchTree() {
    clear();
}

// Recursive helper for insertion
// Duplicate values are rejected to maintain strict standard BST rules
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
        std::cout << "[Warning] Duplicate value " << value << " cannot be inserted into BST.\n";
    }
    return node;
}

// Insert a node into BST
// Time Complexity: O(log n) average, O(n) worst case
bool BinarySearchTree::insert(int value) {
    bool isInserted = false;
    root = insertHelper(root, value, isInserted);
    if (isInserted) {
        std::cout << "[Success] Inserted " << value << " into BST. (Current count: " << count << ")\n";
    }
    return isInserted;
}

// Recursive helper for search
bool BinarySearchTree::searchHelper(BSTNode* node, int value) const {
    if (node == nullptr) {
        return false;
    }
    if (node->data == value) {
        return true;
    }
    if (value < node->data) {
        return searchHelper(node->left, value);
    } else {
        return searchHelper(node->right, value);
    }
}

// Search for a value in BST
// Time Complexity: O(log n) average, O(n) worst case
bool BinarySearchTree::search(int value) const {
    bool found = searchHelper(root, value);
    if (found) {
        std::cout << "[Found] Value " << value << " exists in the BST.\n";
    } else {
        std::cout << "[Not Found] Value " << value << " does not exist in the BST.\n";
    }
    return found;
}

// Inorder traversal: Left -> Root -> Right (Produces sorted order)
// Time Complexity: O(n)
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
// Time Complexity: O(n)
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
// Time Complexity: O(n)
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

// Recursive helper to deallocate nodes (Postorder deallocation)
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
    std::cout << "[BST] Tree cleared and memory freed.\n";
}

// Checks if the tree is empty
bool BinarySearchTree::isEmpty() const {
    return root == nullptr;
}

// Returns the number of nodes in the tree
int BinarySearchTree::size() const {
    return count;
}

// Helper to print all three traversals cleanly
void BinarySearchTree::displayTraversals() const {
    if (isEmpty()) {
        std::cout << "[BST] Tree is currently empty.\n";
        return;
    }

    std::cout << "\n--- BST Traversals (Size: " << count << ") ---\n";
    
    std::vector<int> in = inorder();
    std::cout << "Inorder   (L-Root-R) [Sorted]: ";
    for (int v : in) std::cout << v << " ";
    std::cout << "\n";

    std::vector<int> pre = preorder();
    std::cout << "Preorder  (Root-L-R)         : ";
    for (int v : pre) std::cout << v << " ";
    std::cout << "\n";

    std::vector<int> post = postorder();
    std::cout << "Postorder (L-R-Root)         : ";
    for (int v : post) std::cout << v << " ";
    std::cout << "\n-------------------------------\n";
}
