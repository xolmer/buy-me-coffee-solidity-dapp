// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BuyMeCoffee {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string message,
        string name
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] public memos;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }
}
